import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Basic } from './basic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBasicDto } from './create-basic.dto';
import { GetTime } from './time.decorator';
import { GetSpanAsync } from './span.decorator';

@Injectable()
export class AppService {
  constructor(@InjectModel(Basic.name) private basicModel: Model<Basic>) {}

  async findAll() {
    return this.basicModel.find();
  }

  @GetSpanAsync()
  async randomWait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @GetSpanAsync()
  delaySync(milliseconds: number) {
    const start = new Date().getTime();
    let end = start;
    while (end < start + milliseconds) {
      end = new Date().getTime();
    }
  }

  @GetTime()
  async findById(id: string) {
    const basic = await this.basicModel.findById(id);

    if (basic == null) {
      throw new HttpException(`invalid id: ${id}`, HttpStatus.NOT_FOUND);
    }

    await this.randomWait(2000);
    this.delaySync(1000);

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
