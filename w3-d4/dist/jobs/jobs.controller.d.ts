import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    enqueueRefresh(): Promise<{
        message: string;
        jobId: string;
        status: import("bullmq").JobState | "unknown";
    }>;
    getJobStatus(id: string): Promise<{
        id: string;
        name: string;
        data: any;
        state: import("bullmq").JobState | "unknown";
        progress: import("bullmq").JobProgress;
        attemptsMade: number;
        failedReason: string;
        processedOn: number;
        finishedOn: number;
        timestamp: number;
    }>;
    getJob(id: string): Promise<{
        id: string;
        name: string;
        data: any;
        opts: import("bullmq").JobsOptions;
        progress: import("bullmq").JobProgress;
        attemptsMade: number;
        state: import("bullmq").JobState | "unknown";
    }>;
}
