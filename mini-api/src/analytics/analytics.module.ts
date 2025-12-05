import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

import { Stream, StreamSchema } from '../streams/streams.schema';
import { StreamsModule } from 'src/streams/streams.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
    forwardRef(() => StreamsModule),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
