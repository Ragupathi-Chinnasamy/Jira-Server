import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto, GetTasktDto, UpdateTaskDto } from '@src/dto/task.dto';
import { CurrentUserId } from '@src/decorators/user.decorator';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async createTask(
    @CurrentUserId() createdUserId: number,
    @Body() data: CreateTaskDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.taskService.createTask(createdUserId, files, data);
    return {
      message: 'Task created successfully',
    };
  }

  @Get()
  async findAllTasks(@Query() data: GetTasktDto) {
    return {
      message: 'Tasks fetched successfully',
      data: await this.taskService.findAllTasks(data),
    };
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('file'))
  async updateTask(
    @Body() data: UpdateTaskDto,
    @CurrentUserId() modifiedUserId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.taskService.updateTask(modifiedUserId, files, data);
    return {
      message: 'Task updated successfully',
    };
  }

  @Post('image')
  async deleteImage(@Body('fileName') fileName: string) {
    await this.taskService.deleteImage(fileName);
    return {
      message: 'File removed successfully',
    };
  }
}
