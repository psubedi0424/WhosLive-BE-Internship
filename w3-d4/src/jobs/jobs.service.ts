import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';

@Injectable()
export class JobsService {
    constructor(
        @InjectQueue('refresh')
        private readonly refreshQueue: Queue,
    ) { }

    async enqueueRefresh(data?: any) {
        const job = await this.refreshQueue.add(
            'refresh-data',
            data || { timestamp: Date.now() },
            {
                attempts: 3, // Retry 3 times
                backoff: {
                    type: 'exponential',
                    delay: 5000, // Start with 5 seconds, doubles each retry
                },
                removeOnComplete: false, // Keep completed jobs for status tracking
                removeOnFail: false, // Keep failed jobs for debugging
            },
        );

        return job;
    }

    async getJobStatus(jobId: string) {
        const job = await this.refreshQueue.getJob(jobId);

        if (!job) {
            throw new NotFoundException(`Job with ID ${jobId} not found`);
        }

        const state = await job.getState();
        const progress = job.progress;
        const failedReason = job.failedReason;
        const finishedOn = job.finishedOn;
        const processedOn = job.processedOn;

        return {
            id: job.id,
            name: job.name,
            data: job.data,
            state,
            progress,
            attemptsMade: job.attemptsMade,
            failedReason,
            processedOn,
            finishedOn,
            timestamp: job.timestamp,
        };
    }

    async getJob(jobId: string) {
        const job = await this.refreshQueue.getJob(jobId);

        if (!job) {
            throw new NotFoundException(`Job with ID ${jobId} not found`);
        }

        return {
            id: job.id,
            name: job.name,
            data: job.data,
            opts: job.opts,
            progress: job.progress,
            attemptsMade: job.attemptsMade,
            state: await job.getState(),
        };
    }
}
