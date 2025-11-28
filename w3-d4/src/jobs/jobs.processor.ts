// src/jobs/jobs.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('refreshQueue')
export class JobsProcessor {
    @Process('refreshToken')
    async handleRefresh(job: Job) {
        console.log(`Processing job ${job.id} for user ${job.data.userId}`);

        // simulate workload
        for (let i = 1; i <= 5; i++) {
            await new Promise((res) => setTimeout(res, 500));
            job.progress(i * 20);
        }

        console.log(`Job completed: ${job.id}`);

        return {
            success: true,
        };
    }
}
