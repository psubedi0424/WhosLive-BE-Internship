import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
// import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT || 3000);
  console.log('Listening on', process.env.PORT || 3000);
}
 void bootstrap();
