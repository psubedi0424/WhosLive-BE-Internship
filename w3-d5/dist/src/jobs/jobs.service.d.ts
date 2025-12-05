import { Queue } from 'bull';
export declare class JobsService {
    private readonly queue;
    constructor(queue: Queue);
    enqueueRefresh(userId: string): Promise<import("bull").Job<any>>;
    getStatus(jobId: string): Promise<{
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
