/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/setup-swagger.util';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
// import * as path from 'path';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setupSwagger(app);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['*'],
  });

  // Serve static files from the "public" directoryS
  // app.useStaticAssets(path.join(__dirname, '..', 'public'));

  await app.listen(port, () => {
    console.log('[WEB]', `http://localhost:${port}`);
  });
}

bootstrap();
