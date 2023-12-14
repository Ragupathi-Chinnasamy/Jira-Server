import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskType } from '@src/enum';
import { DashBoardRepository } from '@src/repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashBoardRepo: DashBoardRepository) {}

  async findDashBoardCount() {
    const [
      users,
      projects,
      allTasks,
      tasks,
      bug,
      todo,
      inProgress,
      resoleved,
      reopened,
    ] = await Promise.all([
      this.dashBoardRepo.findUsersCount(),
      this.dashBoardRepo.findProjectsCount(),
      this.dashBoardRepo.findTasksCountByTypeId(0),
      this.dashBoardRepo.findTasksCountByTypeId(TaskType.Task),
      this.dashBoardRepo.findTasksCountByTypeId(TaskType.Bug),
      this.dashBoardRepo.findTasksCountByStatusId(TaskStatus.ToDo),
      this.dashBoardRepo.findTasksCountByStatusId(TaskStatus.InProgress),
      this.dashBoardRepo.findTasksCountByStatusId(TaskStatus.Resolved),
      this.dashBoardRepo.findTasksCountByStatusId(TaskStatus.Reopened),
    ]);

    return {
      'user(s)': users,
      'project(s)': projects,
      'all tasks': allTasks,
      'task(s)': tasks,
      'bug(s)': bug,
      todo,
      inProgress,
      resoleved,
      reopened,
    };
  }
}
