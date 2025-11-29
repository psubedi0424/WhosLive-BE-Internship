import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsProcessor } from './jobs.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'refreshQueue',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsProcessor],
  exports: [BullModule],
})
export class JobsModule {}
