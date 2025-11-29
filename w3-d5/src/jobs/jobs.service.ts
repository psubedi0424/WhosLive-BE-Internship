import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('refreshQueue') private readonly queue: Queue) {}

  async enqueueRefresh(userId: string) {
    // Add a named job type 'refresh'
    return this.queue.add(
      'refresh',
      { userId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  async getStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) return { state: 'not_found' };
    return {
      id: job.id,
      data: job.data,
      state: await job.getState(),
      progress: job.progress(),
    };
  }
}
