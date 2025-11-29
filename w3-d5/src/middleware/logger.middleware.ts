import { Injectable, NestMiddleware } from '@nestjs/common';
import pinoHttp from 'pino-http';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
    customProps(req) {
      return { requestId: req.id };
    },
  });

  use(req: any, res: any, next: () => void) {
    this.logger(req, res);
    next();
  }
}
