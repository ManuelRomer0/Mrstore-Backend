import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap(
  expressApp: Express | undefined = undefined,
  port: number | undefined = undefined,
)

{
  const app = await NestFactory.create(AppModule, new ExpressAdapter (expressApp));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  if (port) {

    await app.listen(port);
  }
  return app;
}
bootstrap();
export async function createApp(expressApp: Express) {
  return bootstrap(expressApp);
}

