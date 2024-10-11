import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as coockieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(coockieParser());
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(4200);
}
bootstrap();
