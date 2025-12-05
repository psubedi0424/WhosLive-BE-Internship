import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { IngestModule } from './ingest/ingest.module';
import { StreamsModule } from './streams/streams.module';
import { CreatorsModule } from './creators/creators.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
// import { throttle } from 'rxjs';
import { ThrottlerModule } from '@nestjs/throttler';
// import { Throttle } from '@nestjs/throttler';
import { RealtimeModule } from './realtime/realtime.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB
    MongooseModule.forRoot(process.env.MONGO_URL),
    //Rate Limiter
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 5, //global rate limit
      },
    ]),
    // Redis
    CacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 10,
      isGlobal: true,
    }),

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'whoslive-redis',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),

    IngestModule,
    StreamsModule,
    CreatorsModule,
    AnalyticsModule,
    RealtimeModule,
  ],
})
export class AppModule {}
