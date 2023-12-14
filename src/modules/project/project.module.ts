import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from '@src/repositories/project.repository';
import { PrismaService } from '@src/database/prisma.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, PrismaService],
})
export class ProjectModule {}
