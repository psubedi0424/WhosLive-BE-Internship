import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    enqueueRefresh(userId: string): Promise<{
        jobId: import("bull").JobId;
        state: string;
    }>;
    status(jobId: string): Promise<{
        state: string;
        id?: undefined;
        data?: undefined;
        progress?: undefined;
    } | {
        id: import("bull").JobId;
        data: any;
        state: import("bull").JobStatus | "stuck";
        progress: any;
    }>;
}
