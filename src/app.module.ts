import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Basic, BasicSchema } from './basic.schema';
import { ConfigModule } from '@nestjs/config';
import { UuidModule } from 'nestjs-uuid';
import { ScheduleModule } from '@nestjs/schedule';
import { logger, LoggerMiddleware } from './logger.middleware';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    MongooseModule.forFeature([{ name: Basic.name, schema: BasicSchema }]),
    UuidModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    console.log('Add class middleware: ');
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(AppController);
    console.log('Add functional middleware: ');
    // consumer.apply(logger).forRoutes(AppController);
  }
}
