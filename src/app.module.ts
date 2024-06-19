import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Basic, BasicSchema } from './basic.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    MongooseModule.forFeature([{ name: Basic.name, schema: BasicSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
