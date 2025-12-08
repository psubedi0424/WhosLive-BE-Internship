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
import { ConfigService } from '@nestjs/config';
import { ShutdownModule } from './shutdown/shutdown.module';
import { RedisModule } from './redis.module';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' //change to development as needed
          ? 'config/prod.env'
          : 'config/dev.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),

    // Redis Cache with ConfigService
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any,
        host: configService.get<string>('REDIS_HOST', 'whoslive-redis'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: 10,
      }),
      inject: [ConfigService],
    }),

    // Bull Queue with ConfigService
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'whoslive-redis'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    IngestModule,
    StreamsModule,
    CreatorsModule,
    AnalyticsModule,
    RealtimeModule,
    ShutdownModule,
    RedisModule,
  ],
})
export class AppModule {}
// // MongoDB
// MongooseModule.forRoot(process.env.MONGO_URL),
//   //Rate Limiter

//   // Redis
//   CacheModule.register({
//     store: redisStore as any,
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     ttl: 10,
//     isGlobal: true,
//   }),

//   BullModule.forRoot({
//     redis: {
//       host: process.env.REDIS_HOST || 'whoslive-redis',
//       port: Number(process.env.REDIS_PORT) || 6379,
//     },
//   }),

//   IngestModule,
//   StreamsModule,
//   CreatorsModule,
//   AnalyticsModule,
//   RealtimeModule,
//   ],
// })
// export class AppModule { }
