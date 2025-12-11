import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/streams (GET)', () => {
    return request(app.getHttpServer()).get('/streams').expect(200);
  });

  it('/analytics/health (GET)', () => {
    return request(app.getHttpServer()).get('/analytics/health').expect(200);
  });

  it('/realtime/health (GET)', () => {
    return request(app.getHttpServer()).get('/realtime/health').expect(200);
  });
});
