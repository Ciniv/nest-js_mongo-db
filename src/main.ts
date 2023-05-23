import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const publicPath = join(__dirname, '..', 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
  app.useStaticAssets(publicPath)
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
