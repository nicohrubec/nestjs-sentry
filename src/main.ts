import './instrument';

import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
// import * as Sentry from '@sentry/node';
import * as Sentry from '@sentry/nestjs';
import { globalLogger } from './global.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

  app.use(globalLogger);
  await app.listen(3000);
}
bootstrap();
