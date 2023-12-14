import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('role')
  @UseGuards(AuthGuard)
  async findAllRoles(
    @Query() { page = 0, search = '' }: { page: number; search: string },
  ) {
    return {
      message: 'Users fetched successfully',
      data: await this.appService.findAllRoles(Number(page), search ?? ''),
    };
  }

  @Get('taskType')
  @UseGuards(AuthGuard)
  async findAllTaskTypes(
    @Query() { page = 0, search = '' }: { page: number; search: string },
  ) {
    return {
      message: 'Users fetched successfully',
      data: await this.appService.findAllTaskTypes(Number(page), search ?? ''),
    };
  }

  @Get('taskStatus')
  @UseGuards(AuthGuard)
  async findAllTaskStatuses(
    @Query() { page = 0, search = '' }: { page: number; search: string },
  ) {
    return {
      message: 'Users fetched successfully',
      data: await this.appService.findAllTaskStatuses(
        Number(page),
        search ?? '',
      ),
    };
  }
}
