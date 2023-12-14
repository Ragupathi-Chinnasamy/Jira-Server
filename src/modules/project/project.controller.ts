import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import {
  CreateProjectDto,
  GetProjectDto,
  UpdateProjectDto,
} from '@src/dto/project.dto';
import { CurrentUserId } from '@src/decorators/user.decorator';
import { AdminAuthGuard } from '@src/guards/admin-auth.guard';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AdminAuthGuard)
  async createProject(
    @Body() data: CreateProjectDto,
    @CurrentUserId() createdUserId: number,
  ) {
    try {
      await this.projectService.createProject(createdUserId, data);
      return {
        message: 'Project created successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllProjects(@Query() { page, search }: GetProjectDto) {
    try {
      return {
        message: 'Projects fetched successfully',
        data: await this.projectService.findAllProjects(
          page ?? 1,
          search ?? '',
        ),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch()
  @UseGuards(AdminAuthGuard)
  async updateProject(
    @Body() data: UpdateProjectDto,
    @CurrentUserId() modifiedUserId: number,
  ) {
    await this.projectService.updateProject(modifiedUserId, data);
    return {
      message: 'Project updated successfuly',
    };
  }
}
