import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '@src/dto/project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private readonly db: PrismaService) {}

  async createProject(createdUserId: number, data: CreateProjectDto) {
    await this.db.project.create({
      data: {
        ...data,
        createdUserId,
      },
    });
  }

  async findProjectById(id: number) {
    return await this.db.project.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async updateProject(
    modifiedUserId: number,
    { projectId, description, title }: UpdateProjectDto,
  ) {
    await this.db.project.update({
      where: {
        id: projectId,
      },
      data: {
        title,
        description,
        modifiedUserId,
      },
    });
  }

  async findAllProjects(
    skip: number,
    take: number,
    filters: Prisma.ProjectWhereInput,
  ) {
    return await this.db.project.findMany({
      skip,
      take,
      where: filters,
      include: {
        createdUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modifiedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAllProjectsCount(filters: Prisma.ProjectWhereInput) {
    return await this.db.project.count({
      where: filters,
    });
  }
}
