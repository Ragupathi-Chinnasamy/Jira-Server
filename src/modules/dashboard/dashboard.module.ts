import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashBoardRepository } from '@src/repositories/dashboard.repository';
import { PrismaService } from '@src/database/prisma.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashBoardRepository, PrismaService],
})
export class DashboardModule {}
