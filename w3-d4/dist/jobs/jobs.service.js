"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
let JobsService = class JobsService {
    constructor(refreshQueue) {
        this.refreshQueue = refreshQueue;
    }
    async enqueueRefresh(data) {
        const job = await this.refreshQueue.add('refresh-data', data || { timestamp: Date.now() }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: false,
            removeOnFail: false,
        });
        return job;
    }
    async getJobStatus(jobId) {
        const job = await this.refreshQueue.getJob(jobId);
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found`);
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
    async getJob(jobId) {
        const job = await this.refreshQueue.getJob(jobId);
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${jobId} not found`);
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
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('refresh')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], JobsService);
//# sourceMappingURL=jobs.service.js.map