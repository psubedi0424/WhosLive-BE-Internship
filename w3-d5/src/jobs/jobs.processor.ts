import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('refreshQueue')
export class JobsProcessor {
  @Process('refresh')
  async handleRefresh(job: Job) {
    console.log(`Processing job ${job.id} for user ${job.data.userId}`);

    // simulate work with progress updates
    for (let i = 1; i <= 5; i++) {
      await new Promise((res) => setTimeout(res, 400));
      job.progress(i * 20); // 20,40,...100
    }

    console.log(`Job ${job.id} completed`);
    return { ok: true };
  }
}
