import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';
import { Stream, StreamSchema } from './streams.schema';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stream.name, schema: StreamSchema }]),
    forwardRef(() => AnalyticsModule),
  ],
  controllers: [StreamsController],
  providers: [StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}
