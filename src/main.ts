import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalLogger } from './global.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Add global middleware: ');
  app.use(globalLogger);

  await app.listen(3000);
}
bootstrap();
