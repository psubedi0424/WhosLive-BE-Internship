import { Queue, Job } from 'bullmq';
export declare class JobsService {
    private readonly refreshQueue;
    constructor(refreshQueue: Queue);
    enqueueRefresh(data?: any): Promise<Job<any, any, string>>;
    getJobStatus(jobId: string): Promise<{
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
    getJob(jobId: string): Promise<{
        id: string;
        name: string;
        data: any;
        opts: import("bullmq").JobsOptions;
        progress: import("bullmq").JobProgress;
        attemptsMade: number;
        state: import("bullmq").JobState | "unknown";
    }>;
}
