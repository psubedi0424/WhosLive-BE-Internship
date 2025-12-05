"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const app_errors_1 = require("../errors/app.errors");
let AppExceptionFilter = class AppExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        let status = 500;
        let message = 'Internal Server Error';
        if (exception instanceof app_errors_1.AppError) {
            status = exception.status;
            message = exception.message;
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();
            if (typeof resp === 'string') {
                message = resp;
            }
            else if (typeof resp === 'object' && resp !== null) {
                const responseObj = resp;
                if (typeof responseObj.message === 'string') {
                    message = responseObj.message;
                }
                else if (typeof responseObj.error === 'string') {
                    message = responseObj.error;
                }
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        res.status(status).json({
            success: false,
            message,
            status,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=app-exception.filter.js.map