import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBasicDto } from './create-basic.dto';
// import * as Sentry from '@sentry/node'
import * as Sentry from '@sentry/nestjs';
import { LoggingInterceptor } from './logging.interceptor';
import { LocalExampleExceptionFilter } from './exception.filter';
import { LocalExampleException } from './example.exception';

@Controller()
@UseInterceptors(LoggingInterceptor)
@UseFilters(LocalExampleExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll() {
    console.log('GET /');
    return await this.appService.findAll();
  }

  @Get('httpError')
  httpError() {
    console.log('GET /httpError');
    throw new LocalExampleException();
  }

  @Get('test-pipe-instrumentation/:id')
  testPipeInstrumentation(@Param('id', ParseIntPipe) id: number) {
    return { value: id };
  }

  @Post()
  async create(@Body() createBasicDto: CreateBasicDto) {
    console.log('POST /');
    return await this.appService.create(createBasicDto);
  }

  @Get('/error')
  async throw_error() {
    console.log('GET /error');
    throw new Error('Random error that should be tracked.');
  }

  @Get('/expectedError')
  async throw_not_found() {
    console.log('GET /expectedError');
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('/sentryError')
  async throw_sentry_error() {
    console.log('GET /sentryError');
    Sentry.startSpan(
      {
        op: 'test',
        name: 'My First Test Transaction',
      },
      () => {
        setTimeout(() => {
          try {
            throw new Error('Error!');
          } catch (e) {
            Sentry.captureException(e);
          }
        }, 99);
      },
    );
  }

  @Get('/sentrySpan')
  async get_span() {
    console.log('GET /sentrySpan');
    Sentry.startSpan(
      {
        op: 'test_span',
        name: 'My First Test Transaction Span',
      },
      () => {
        setTimeout(() => {
          console.log('Hello Sentry!');
        }, 99);
      },
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log('GET /' + id);
    return await this.appService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('DELETE /' + id);
    return await this.appService.delete(id);
  }
}
