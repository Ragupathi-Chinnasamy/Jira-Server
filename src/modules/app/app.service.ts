import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppRepository } from '@src/repositories/app.respository';
import { calculateSkipAndTake, paginationResponse } from '@src/utils';

@Injectable()
export class AppService {
  constructor(private readonly appRepo: AppRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async findAllRoles(page: number, search: string) {
    try {
      const itemsPerPage = 10;
      const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

      const filter: Prisma.RoleWhereInput = {
        isActive: true,
        OR: search.length > 0 ? [{ role: { contains: search } }] : undefined,
      };

      const [totalCount, users] = await Promise.all([
        this.appRepo.findRolesCount(filter),
        this.appRepo.findAllRoles(skip, take, filter),
      ]);

      return paginationResponse(page, itemsPerPage, totalCount, users);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllTaskTypes(page: number, search: string) {
    try {
      const itemsPerPage = 10;
      const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

      const filter: Prisma.TaskTypeWhereInput = {
        isActive: true,
        OR: search.length > 0 ? [{ type: { contains: search } }] : undefined,
      };

      const [totalCount, users] = await Promise.all([
        this.appRepo.findTaskTypesCount(filter),
        this.appRepo.findTaskTypes(skip, take, filter),
      ]);

      return paginationResponse(page, itemsPerPage, totalCount, users);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAllTaskStatuses(page: number, search: string) {
    try {
      const itemsPerPage = 10;
      const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

      const filter: Prisma.TaskStatusWhereInput = {
        isActive: true,
        OR: search.length > 0 ? [{ status: { contains: search } }] : undefined,
      };

      const [totalCount, users] = await Promise.all([
        this.appRepo.findTaskStatusCount(filter),
        this.appRepo.findTaskStatuses(skip, take, filter),
      ]);

      return paginationResponse(page, itemsPerPage, totalCount, users);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
