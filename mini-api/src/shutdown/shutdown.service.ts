import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';

@Injectable()
export class ShutdownService implements OnModuleDestroy, OnApplicationShutdown {
  async onModuleDestroy() {
    console.log('Cleanup before shutdown...');
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`Application shutdown with signal: ${signal}`);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
