import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { Stream, StreamSchema } from './streams.schema';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import Redis from 'ioredis';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
    forwardRef(() => AnalyticsModule),
  ],
  controllers: [StreamsController],
  providers: [
    StreamsService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || 'redis',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          // Optional: Add other config
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
          lazyConnect: true,
        });
      },
    },
  ],
  exports: [StreamsService, 'REDIS_CLIENT'],
})
export class StreamsModule {}
