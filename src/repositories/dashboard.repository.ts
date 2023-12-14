import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/database/prisma.service';

@Injectable()
export class DashBoardRepository {
  constructor(private readonly db: PrismaService) {}

  async findUsersCount() {
    return await this.db.user.count({
      where: { isActive: true },
    });
  }

  async findProjectsCount() {
    return await this.db.project.count({
      where: { isActive: true },
    });
  }

  async findTasksCountByTypeId(typeId: number) {
    return await this.db.task.count({
      where: { isActive: true, typeId: typeId > 0 ? typeId : undefined },
    });
  }

  async findTasksCountByStatusId(statusId: number) {
    return await this.db.task.count({
      where: {
        isActive: true,
        statusId,
      },
    });
  }
}
