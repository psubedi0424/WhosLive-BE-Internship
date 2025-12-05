import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
