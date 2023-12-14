import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTaskDto, GetTasktDto, UpdateTaskDto } from '@src/dto/task.dto';
import { TaskRepository } from '@src/repositories/task.repository';
import { calculateSkipAndTake, paginationResponse } from '@src/utils';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  async createTask(
    createdUserId: number,
    files: Express.Multer.File[],
    data: CreateTaskDto,
  ) {
    await this.taskRepo.createTask(createdUserId, files, data);
  }

  async findAllTasks({
    page = 0,
    search = '',
    projectId,
    typeId = 0,
    statusId = 0,
    assigneeId,
  }: GetTasktDto) {
    const itemsPerPage = 10;

    const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

    const filters: Prisma.TaskWhereInput = {
      isActive: true,
      projectId: projectId > 0 ? projectId : undefined,
      typeId: typeId > 0 ? typeId : undefined,
      statusId: statusId > 0 ? statusId : undefined,
      taskAssignees:
        assigneeId > 0
          ? {
              some: {
                isActive: true,
                userId: assigneeId,
              },
            }
          : undefined,
      OR:
        search.length > 0
          ? [
              { title: { contains: search } },
              { description: { contains: search } },
              {
                taskAssignees: {
                  some: {
                    user: {
                      firstName: { contains: search },
                      lastName: { contains: search },
                      mobile: { contains: search },
                      email: { contains: search },
                    },
                  },
                },
              },
            ]
          : undefined,
    };

    const [totalCount, data] = await Promise.all([
      this.taskRepo.findAllTasksCount(filters),
      this.taskRepo.findAllTasks(skip, take, filters),
    ]);

    return paginationResponse(page, itemsPerPage, totalCount, data);
  }

  async updateTask(
    modifiedUserId: number,
    files: Express.Multer.File[],
    data: UpdateTaskDto,
  ) {
    if (!(await this.taskRepo.findTaskById(data.taskId))) {
      throw new BadRequestException('Task not found');
    }

    await this.taskRepo.updateTask(modifiedUserId, files, data);
  }

  async deleteImage(fileName: string) {
    await this.taskRepo.deleteImage(fileName);
  }
}
