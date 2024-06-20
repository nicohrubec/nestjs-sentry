import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBasicDto } from './create-basic.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll() {
    return await this.appService.findAll();
  }

  @Post()
  async create(@Body() createBasicDto: CreateBasicDto) {
    return await this.appService.create(createBasicDto);
  }

  @Get("/error")
  async throw_error() {
    throw new Error("Random error that should be tracked.");
  }

  @Get(":id")
  async findById(@Param('id') id: string) {
    return await this.appService.findById(id);
  }

  @Delete(":id")
  async delete(@Param('id') id: string) {
    return await this.appService.delete(id);
  }
}
