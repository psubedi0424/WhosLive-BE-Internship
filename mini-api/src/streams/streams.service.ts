import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stream } from './streams.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AnalyticsService } from '../analytics/analytics.service';
@Injectable()
export class StreamsService {
  constructor(
    @InjectModel(Stream.name) private streamModel: Model<Stream>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private analyticsService: AnalyticsService,
  ) {}

  // ⬅ Cached FIND ALL with optional search
  async findAll(q?: string) {
    const cacheKey = q ? `streams:q=${q}` : 'streams:all';

    // 1. cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // 2. DB filter
    const filter = q ? { title: { $regex: q, $options: 'i' } } : {};
    const results = await this.streamModel.find(filter).lean().exec();

    // 3. save to cache
    await this.cache.set(cacheKey, results, 10_000);

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
    await this.cache.del('streams:all');

    if (data.creatorId) {
      await this.cache.del(`creator:${data.creatorId}:streams`);
    }
    await this.analyticsService.invalidate();
    return updated;
  }
}
