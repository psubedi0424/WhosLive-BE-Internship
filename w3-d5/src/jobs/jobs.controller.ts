import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('refresh')
  async enqueueRefresh(@Body('userId') userId: string) {
    const job = await this.jobsService.enqueueRefresh(userId);
    return { jobId: job.id, state: 'queued' };
  }

  @Post('status')
  async status(@Body('jobId') jobId: string) {
    return this.jobsService.getStatus(jobId);
  }
}
