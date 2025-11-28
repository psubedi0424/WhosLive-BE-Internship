import { Controller, Post, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @Post('refresh')
    async enqueueRefresh() {
        const job = await this.jobsService.enqueueRefresh();
        return {
            message: 'Refresh job enqueued',
            jobId: job.id,
            status: await job.getState(),
        };
    }

    @Get(':id/status')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10) // Cache for 10 seconds
    async getJobStatus(@Param('id') id: string) {
        return this.jobsService.getJobStatus(id);
    }

    @Get(':id')
    async getJob(@Param('id') id: string) {
        return this.jobsService.getJob(id);
    }
}