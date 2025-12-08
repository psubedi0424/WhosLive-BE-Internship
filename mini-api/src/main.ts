import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { ThrottlerStorageService } from '@nestjs/throttler/dist/throttler-storage.interface';
// import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-options.interface';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3001',
    'https://your-prod-site.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // allow server-to-server or curl (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS Not Allowed'), false);
    },
    credentials: true,
  });
  // // Manually create dependencies (NOT RECOMMENDED)
  // const options: ThrottlerModuleOptions = {
  //   throttlers: [
  //     {
  //       ttl: 60000,
  //       limit: 5,
  //     },
  //   ],
  // };
  // const storage = new ThrottlerStorageService();
  // const guard = new ThrottlerGuard(options, storage, app.get(Reflector));

  // app.useGlobalGuards(guard);
  //slowloris attack prevention
  // const server = app.getHttpServer().getHttpAdapter().getInstance();
  // server.setTimeout(5000);

  const config = new DocumentBuilder()
    .setTitle('WhosLive API')
    .setDescription('Mini WhosLive Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000);
  // not required as enableshutdownhooks handles it
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing server...');
    await app.close();
    process.exit(0);
  });
}
bootstrap();
