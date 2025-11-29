import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { StatsController } from './stats/stats.controller';
import { JobsModule } from './jobs/jobs.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
// import { JobsController } from './jobs/jobs.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Redis cache (global)
    CacheModule.register({
      store: redisStore as any,
      host: '127.0.0.1',
      port: 6379,
      ttl: 10,
      isGlobal: true,
      max: 100,
    }),

    // Bull root (connection)
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),

    // JobsModule registers the named queues
    JobsModule,
  ],
  controllers: [AppController, StatsController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
