import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Queue } from 'bull';
// import { get } from 'http';
import { getQueueToken } from '@nestjs/bull';
import { setupBullBoard } from '../src/bullboard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const refreshQueue = app.get<Queue>(getQueueToken('refreshQueue'));

  setupBullBoard(app, refreshQueue);

  await app.listen(3000);
  console.log('Server listening on http://localhost:3000');
  console.log('Bull Board available on http://localhost:3000/admin/queues');
}
bootstrap();
