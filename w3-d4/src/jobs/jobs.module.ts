import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { RefreshProcessor } from './refresh.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'refresh',
        }),
    ],
    controllers: [JobsController],
    providers: [JobsService, RefreshProcessor],
})
export class JobsModule { }