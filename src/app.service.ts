import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    let basic = await this.basicModel.findById(id);

    if (basic == null) {
      throw new HttpException(
        `invalid id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return basic;
  }

  async create(createBasicDto: CreateBasicDto): Promise<Basic> {
    const createdBasic = new this.basicModel(createBasicDto);
    return await createdBasic.save();
  }

  async delete(id: string) {
    await this.findById(id);
    await this.basicModel.findByIdAndDelete(id);
  }
}
