import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FetchGuard } from './fetch.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new FetchGuard());
  await app.listen(3000);
}
bootstrap();
