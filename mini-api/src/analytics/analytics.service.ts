import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Stream } from '../streams/streams.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Stream.name) private streamModel: Model<Stream>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async snapshot() {
    const cacheKey = 'analytics:now';

    // 1️⃣ Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { cached: true, data: cached };
    }

    // 2️⃣ Heavy DB work
    const total = await this.streamModel.countDocuments();
    const topGames = await this.streamModel.aggregate([
      { $group: { _id: '$game', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const result = { total, topGames };

    // 3️⃣ Store in cache (TTL = 10s)
    await this.cache.set(cacheKey, result, 10_000);

    return { cached: false, data: result };
  }

  // 4️⃣ Invalidation method (called from StreamsService on write)
  async invalidate() {
    await this.cache.del('analytics:now');
  }
}
