import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';


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
}
