import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap(
  expressApp: Express | undefined = undefined,
  port: number | undefined = undefined,
) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({ origin: '*' });

  if (port) {
    await app.listen(port);
  }
  return app;
}

bootstrap(undefined, Number(process.env.PORT));

export async function createApp(
  expressApp: Express,
): Promise<INestApplication> {
  return bootstrap(expressApp);
}
