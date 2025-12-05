import { INestApplication } from '@nestjs/common';
import { Queue } from 'bull';
export declare function setupBullBoard(app: INestApplication, queue: Queue): void;
