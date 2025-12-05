import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
export declare function setupBullBoard(queues: Queue[]): ExpressAdapter;
