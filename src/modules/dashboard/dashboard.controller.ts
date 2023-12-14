import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findDashBoardCount() {
    return {
      message: 'Dashboard count fetched successfully',
      data: await this.dashboardService.findDashBoardCount(),
    };
  }
}
