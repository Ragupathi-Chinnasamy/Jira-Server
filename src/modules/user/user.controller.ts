import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from '@src/dto/user.dto';
import { AdminAuthGuard } from '@src/guards/admin-auth.guard';
import { CurrentUserId } from '@src/decorators/user.decorator';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllUsers(@Query() { page, search }: GetUsersDto) {
    return {
      message: 'Users fetched successfully',
      data: await this.userService.findAllUsers(
        Number(page ?? 0),
        search ?? '',
      ),
    };
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  async createUser(
    @Body() data: CreateUserDto,
    @CurrentUserId() createdUserId: number,
  ) {
    await this.userService.createUser(data, createdUserId);
    return {
      message: 'User created successfully',
    };
  }

  @Patch('')
  @UseGuards(AdminAuthGuard)
  async updateUser(
    @Body() data: UpdateUserDto,
    @CurrentUserId() modifiedUserId: number,
  ) {
    await this.userService.updateUser(modifiedUserId, data);
    return {
      message: 'User updated successfully',
    };
  }
}
