"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const bull_1 = require("@nestjs/bull");
const app_controller_1 = require("./app.controller");
const stats_controller_1 = require("./stats/stats.controller");
const jobs_module_1 = require("./jobs/jobs.module");
const request_id_middleware_1 = require("./middleware/request-id.middleware");
const logger_middleware_1 = require("./middleware/logger.middleware");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_id_middleware_1.RequestIdMiddleware, logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.register({
                store: redisStore,
                host: '127.0.0.1',
                port: 6379,
                ttl: 10,
                isGlobal: true,
                max: 100,
            }),
            bull_1.BullModule.forRoot({
                redis: {
                    host: '127.0.0.1',
                    port: 6379,
                },
            }),
            jobs_module_1.JobsModule,
        ],
        controllers: [app_controller_1.AppController, stats_controller_1.StatsController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map