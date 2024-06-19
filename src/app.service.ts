import { Injectable } from '@nestjs/common';
import { Basic } from './basic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBasicDto } from './create-basic.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Basic.name) private basicModel: Model<Basic>) {}

  async findAll(): Promise<Basic[]> {
    return this.basicModel.find().exec();
  }

  async findById(id: string): Promise<Basic> {
    return this.basicModel.findById(id);
  }

  async create(createBasicDto: CreateBasicDto): Promise<Basic> {
    const createdBasic = new this.basicModel(createBasicDto);
    return createdBasic.save();
  }
}
