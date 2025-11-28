import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('refresh')
export class RefreshProcessor extends WorkerHost {
  private readonly logger = new Logger(RefreshProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`
        Processing job ${job.id} (Attempt ${job.attemptsMade + 1})`);

    try {
      // Simulate work with progress updates
      await job.updateProgress(10);
      await this.simulateWork(2000);

      await job.updateProgress(50);
      this.logger.log(`Job ${job.id}: Halfway done`);
      await this.simulateWork(2000);

      // Simulate occasional failures for testing backoff
      if (job.attemptsMade === 0 && Math.random() < 0.3) {
        throw new Error('Simulated failure for backoff testing');
      }

      await job.updateProgress(100);
      this.logger.log(`Job ${job.id}: Completed successfully`);

      return {
        success: true,
        processedAt: new Date().toISOString(),
        data: job.data,
      };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      throw error; // Re-throw to trigger backoff retry
    }
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed on attempt ${job.attemptsMade}/${job.opts.attempts}: ${error.message}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }

  private simulateWork(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
