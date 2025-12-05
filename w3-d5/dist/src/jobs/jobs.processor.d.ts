import { Job } from 'bull';
export declare class JobsProcessor {
    handleRefresh(job: Job): Promise<{
        ok: boolean;
    }>;
}
