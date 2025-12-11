import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stream } from './streams.schema';
import { Model } from 'mongoose';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { AnalyticsService } from '../analytics/analytics.service';
import Redis from 'ioredis';
@Injectable()
export class StreamsService {
  constructor(
    @InjectModel(Stream.name) private streamModel: Model<Stream>,
    @Inject('REDIS_CLIENT') private redis: Redis,
    private analyticsService: AnalyticsService,
  ) {}

  // ⬅ Cached FIND ALL with optional search
  async findAll(q?: string) {
    const cacheKey = q ? `streams:q=${q}` : 'streams:all';

    // 1. cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. DB filter
    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};
    const results = await this.streamModel.find(filter).lean().exec();

    // 3. save to cache
    await this.redis.setex(cacheKey, 10, JSON.stringify(results));

    return results;
  }

  // ⬅ Idempotent UPSERT + cache invalidation
  async upsertStream(data: any) {
    const updated = await this.streamModel.findOneAndUpdate(
      { streamId: data.streamId },
      { $set: data },
      { upsert: true, new: true },
    );

    // ❗Invalidate cache
    await this.redis.del('streams:all');

    const keys = await this.redis.keys('streams:q=*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }

    if (data.creatorId) {
      await this.redis.del(`creator:${data.creatorId}:streams`);
    }
    await this.analyticsService.invalidate();
    return updated;
  }
}
