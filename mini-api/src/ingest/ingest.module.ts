import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { IngestProcessor } from './ingest.processor';
import { IngestService } from './ingest.service';
import { StreamsModule } from '../streams/streams.module';
import { IngestController } from './ingest.controller';

@Module({
  imports: [
    StreamsModule,
    BullModule.registerQueue({
      name: 'ingest',
    }),
  ],
  controllers: [IngestController],
  providers: [IngestService, IngestProcessor],
  exports: [IngestService],
})
export class IngestModule {}
