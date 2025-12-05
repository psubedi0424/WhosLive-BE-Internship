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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
let JobsProcessor = class JobsProcessor {
    async handleRefresh(job) {
        console.log(`Processing job ${job.id} for user ${job.data.userId}`);
        for (let i = 1; i <= 5; i++) {
            await new Promise((res) => setTimeout(res, 500));
            job.progress(i * 20);
        }
        console.log(`Job completed: ${job.id}`);
        return {
            success: true,
        };
    }
};
exports.JobsProcessor = JobsProcessor;
__decorate([
    (0, bull_1.Process)('refreshToken'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsProcessor.prototype, "handleRefresh", null);
exports.JobsProcessor = JobsProcessor = __decorate([
    (0, bull_1.Processor)('refreshQueue')
], JobsProcessor);
//# sourceMappingURL=jobs.processor.js.map