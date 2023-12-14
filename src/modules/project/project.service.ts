import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from '@src/dto/project.dto';
import { ProjectRepository } from '@src/repositories/project.repository';
import { calculateSkipAndTake, paginationResponse } from '@src/utils';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async createProject(createdUserId: number, data: CreateProjectDto) {
    try {
      await this.projectRepo.createProject(createdUserId, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllProjects(page: number, search: string) {
    const itemsPerPage = 10;
    const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

    const filters: Prisma.ProjectWhereInput = {
      isActive: true,
      OR:
        search != null && search.length > 0
          ? [
              { title: { contains: search } },
              { description: { contains: search } },
            ]
          : undefined,
    };

    const [total, data] = await Promise.all([
      this.projectRepo.findAllProjectsCount(filters),
      this.projectRepo.findAllProjects(skip, take, filters),
    ]);

    return paginationResponse(page, itemsPerPage, total, data);
  }

  async updateProject(modifiedUserId: number, data: UpdateProjectDto) {
    if (!(await this.projectRepo.findProjectById(data.projectId))) {
      throw new BadRequestException('Project not found');
    }

    await this.projectRepo.updateProject(modifiedUserId, data);
  }
}
