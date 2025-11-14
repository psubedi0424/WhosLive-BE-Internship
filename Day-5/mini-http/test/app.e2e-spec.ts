import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/ok (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/ok');
    expect(res.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.success).toBe(true);
  });
  it('/fail (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/fail');
    expect(res.status).toBe(500);
  });
  it('/missing (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/missing');
    expect(res.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.success).toBe(false);
  });
});
