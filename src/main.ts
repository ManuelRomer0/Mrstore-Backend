import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap(
  expressApp: Express | undefined = undefined,
  port: number | undefined = undefined,
) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      cors: {
        origin: '*',
        methods: 'GET,POST,OPTIONS',
        allowedHeaders:
          'Content-Type, Accept, Authorization, X-Requested-With, Application, Origin, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods',
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  if (port) {
    await app.listen(port);
  }
  return app;
}

bootstrap(undefined, Number(process.env.PORT));

export async function createApp(expressApp: Express) {
  return bootstrap(expressApp);
}
