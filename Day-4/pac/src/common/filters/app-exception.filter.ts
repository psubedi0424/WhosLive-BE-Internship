import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
 
import { AppError } from '../errors/app.errors';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        let status = 500;
        let message = 'Internal Server Error';

        if (exception instanceof AppError) {
            status = exception.status;
            message = exception.message;
        }
        else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();

            if (typeof resp === 'string') {
                message = resp;
            } else if (typeof resp === 'object' && resp !== null) {
                const responseObj = resp as { message?: unknown; error?: unknown };
                if (typeof responseObj.message === 'string') {
                    message = responseObj.message;
                } else if (typeof responseObj.error === 'string') {
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
} 