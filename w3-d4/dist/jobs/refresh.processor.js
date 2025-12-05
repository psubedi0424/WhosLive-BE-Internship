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
var RefreshProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
let RefreshProcessor = RefreshProcessor_1 = class RefreshProcessor extends bullmq_1.WorkerHost {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(RefreshProcessor_1.name);
    }
    async process(job) {
        this.logger.log(`
        Processing job ${job.id} (Attempt ${job.attemptsMade + 1})`);
        try {
            await job.updateProgress(10);
            await this.simulateWork(2000);
            await job.updateProgress(50);
            this.logger.log(`Job ${job.id}: Halfway done`);
            await this.simulateWork(2000);
            if (job.attemptsMade === 0 && Math.random() < 0.3) {
                throw new Error('Simulated failure for backoff testing');
            }
            await job.updateProgress(100);
            this.logger.log(`Job ${job.id}: Completed successfully`);
            return {
                success: true,
                processedAt: new Date().toISOString(),
                data: job.data,
            };
        }
        catch (error) {
            this.logger.error(`Job ${job.id} failed: ${error.message}`);
            throw error;
        }
    }
    onCompleted(job) {
        this.logger.log(`Job ${job.id} completed successfully`);
    }
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed on attempt ${job.attemptsMade}/${job.opts.attempts}: ${error.message}`);
    }
    onActive(job) {
        this.logger.log(`Job ${job.id} is now active`);
    }
    simulateWork(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.RefreshProcessor = RefreshProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], RefreshProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], RefreshProcessor.prototype, "onFailed", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], RefreshProcessor.prototype, "onActive", null);
exports.RefreshProcessor = RefreshProcessor = RefreshProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('refresh')
], RefreshProcessor);
//# sourceMappingURL=refresh.processor.js.map