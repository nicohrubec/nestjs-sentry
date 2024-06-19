import { Injectable } from '@nestjs/common';
import { Basic } from './basic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Basic.name) private basicModel: Model<Basic>) {}

  async findAll(): Promise<Basic[]> {
    return this.basicModel.find().exec();
  }

  async findById(id: string): Promise<Basic> {
    return this.basicModel.findById(id);
  }
}
