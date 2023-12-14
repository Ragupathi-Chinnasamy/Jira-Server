import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class AppRepository {
  constructor(private readonly db: PrismaService) {}

  async findRolesCount(filter: Prisma.RoleWhereInput) {
    return await this.db.role.count({
      where: filter,
    });
  }

  async findAllRoles(
    skip: number,
    take: number,
    filter: Prisma.RoleWhereInput,
  ) {
    return await this.db.role.findMany({
      skip,
      take,
      where: filter,
    });
  }

  async findTaskTypesCount(filter: Prisma.TaskTypeWhereInput) {
    return await this.db.taskType.count({
      where: filter,
    });
  }

  async findTaskTypes(
    skip: number,
    take: number,
    filter: Prisma.TaskTypeWhereInput,
  ) {
    return await this.db.taskType.findMany({
      skip,
      take,
      where: filter,
    });
  }

  async findTaskStatusCount(filter: Prisma.TaskStatusWhereInput) {
    return await this.db.taskStatus.count({
      where: filter,
    });
  }

  async findTaskStatuses(
    skip: number,
    take: number,
    filter: Prisma.TaskStatusWhereInput,
  ) {
    return await this.db.taskStatus.findMany({
      skip,
      take,
      where: filter,
    });
  }
}
