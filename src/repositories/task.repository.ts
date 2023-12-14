import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from '@src/dto/task.dto';
import { TaskStatus } from '@src/enum';

@Injectable()
export class TaskRepository {
  constructor(private readonly db: PrismaService) {}

  async createTask(
    createdUserId: number,
    files: Express.Multer.File[],
    { title, description, projectId, taskAssigneeId, typeId }: CreateTaskDto,
  ) {
    await this.db.task.create({
      data: {
        title,
        description,
        projectId,
        typeId,
        statusId: TaskStatus.ToDo,
        createdUserId,
        taskAssignees: {
          create: taskAssigneeId.map((userId) => ({
            userId: +userId,
          })),
        },
        taskImages: {
          create: files.map((file) => ({ image: file.filename })),
        },
      },
    });
  }

  async findAllTasksCount(filters: Prisma.TaskWhereInput) {
    return await this.db.task.count({
      where: filters,
    });
  }

  async findAllTasks(
    skip: number,
    take: number,
    filters: Prisma.TaskWhereInput,
  ) {
    return await this.db.task.findMany({
      skip,
      take,
      where: filters,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        status: {
          select: {
            id: true,
            status: true,
          },
        },
        type: {
          select: {
            id: true,
            type: true,
          },
        },
        taskAssignees: {
          where: {
            isActive: true,
            user: {
              isActive: true,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        taskImages: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            image: true,
          },
        },
        createdByUser: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        modifiedByUser: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findTaskById(id: number) {
    return await this.db.task.findFirst({
      where: { id, isActive: true },
    });
  }

  async updateTask(
    modifiedUserId: number,
    files: Express.Multer.File[],
    {
      taskId,
      title,
      description,
      statusId,
      taskAssigneeId,
      typeId,
    }: UpdateTaskDto,
  ) {
    await this.db.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        description,
        statusId,
        typeId,
        modifiedUserId,
        taskAssignees: {
          updateMany: {
            where: {
              isActive: true,
            },
            data: {
              isActive: false,
            },
          },
          create: taskAssigneeId.map((assigneeId) => ({
            userId: +assigneeId,
          })),
        },
        taskImages:
          files?.length > 0
            ? {
                create: files.map((file) => ({
                  image: file.filename,
                })),
              }
            : undefined,
      },
    });
  }

  async deleteImage(fileName: string) {
    await this.db.taskImage.updateMany({
      where: {
        isActive: true,
        image: fileName,
      },
      data: {
        isActive: false,
      },
    });
  }
}
