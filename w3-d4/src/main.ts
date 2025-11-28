import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupBullBoard } from './bullboard';
import { Queue } from 'bullmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the refresh queue instance
  const refreshQueue = app.get<Queue>('BullQueue_refresh');

  // Setup BullBoard
  const serverAdapter = setupBullBoard([refreshQueue]);
  app.use('/admin/queues', serverAdapter.getRouter());

  await app.listen(3000);
  console.log('Application running on: http://localhost:3000');
  console.log('BullBoard UI: http://localhost:3000/admin/queues');
}
bootstrap();
