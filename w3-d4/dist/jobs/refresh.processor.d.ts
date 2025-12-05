import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class RefreshProcessor extends WorkerHost {
    private readonly logger;
    process(job: Job): Promise<any>;
    onCompleted(job: Job): void;
    onFailed(job: Job, error: Error): void;
    onActive(job: Job): void;
    private simulateWork;
}
