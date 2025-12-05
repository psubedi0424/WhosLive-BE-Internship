import { Module } from '@nestjs/common';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
// import { StreamsService } from '../streams/streams.service';
import { StreamsModule } from 'src/streams/streams.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [StreamsModule, AnalyticsModule, CacheModule.register()],
  controllers: [RealtimeController],
  providers: [RealtimeService],
})
export class RealtimeModule {}
