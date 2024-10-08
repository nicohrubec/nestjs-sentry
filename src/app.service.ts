import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Basic } from './basic.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBasicDto } from './create-basic.dto';
import { GetTime } from './time.decorator';
import { SentryTraced, SentryCron } from '@sentry/nestjs';
import { Cron } from '@nestjs/schedule';
import { MonitorConfig } from '@sentry/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const monitorConfig: MonitorConfig = {
  schedule: {
    type: 'crontab',
    value: '* * * * *',
  },
  checkinMargin: 2, // In minutes. Optional.
  maxRuntime: 10, // In minutes. Optional.
  timezone: 'America/Los_Angeles', // Optional.
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(Basic.name) private basicModel: Model<Basic>,
    @Inject(CACHE_MANAGER) public cacheManager: Cache,
  ) {}

  async findAll() {
    console.log('set cache value in app');
    await this.cacheManager.set('key', 'value');
    const value = await this.cacheManager.get('key');
    console.log('got value from cache: ');
    console.log(value);
    console.log('del value from cache');
    await this.cacheManager.del('key');
    return this.basicModel.find();
  }

  @SentryTraced()
  async randomWait(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  @SentryTraced()
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

  @Cron('* * * * *')
  @SentryCron('test-cron-slug', monitorConfig)
  handleCron() {
    this.logger.debug('Cron job!');
  }
}
