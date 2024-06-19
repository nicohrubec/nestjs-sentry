import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBasicDto } from './create-basic.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll() {
    return await this.appService.findAll();
  }

  @Get()
  async findById(@Param('id') id: string) {
    return await this.appService.findById(id);
  }

  @Post()
  async create(@Body() createBasicDto: CreateBasicDto) {
    return await this.appService.create(createBasicDto);
  }
}
