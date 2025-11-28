import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    // Redis Cache Configuration
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      ttl: 300, // 5 minutes default TTL
    }),

    // BullMQ Configuration
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    JobsModule,
  ],
})
export class AppModule { }