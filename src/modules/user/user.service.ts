import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '@src/dto/user.dto';
import { AppError } from '@src/enum';
import { UserRepository } from '@src/repositories/user.repository';
import { calculateSkipAndTake, paginationResponse } from '@src/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findAllUsers(page: number, search: string) {
    try {
      const itemsPerPage = 10;
      const { skip, take } = calculateSkipAndTake(page, itemsPerPage);

      const filter: Prisma.UserWhereInput = {
        isActive: true,
        OR:
          search.length > 0
            ? [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { mobile: { contains: search } },
              ]
            : undefined,
      };

      const [totalCount, users] = await Promise.all([
        this.userRepo.findUsersCount(filter),
        this.userRepo.findUsers(skip, take, filter),
      ]);

      return paginationResponse(page, itemsPerPage, totalCount, users);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createUser(data: CreateUserDto, createdUserId: number) {
    try {
      if (await this.userRepo.isMobileExist(data.mobile)) {
        throw new BadRequestException(
          AppError.UNIQUE_CONSTRAINT.replace('{0}', 'Mobile'),
        );
      } else if (await this.userRepo.isEmailExist(data.email)) {
        throw new BadRequestException(
          AppError.UNIQUE_CONSTRAINT.replace('{0}', 'Email'),
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      await this.userRepo.createUser(data, hashedPassword, createdUserId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(modifiedUserId: number, data: UpdateUserDto) {
    try {
      if (!(await this.userRepo.findUserById(data.userId))) {
        throw new BadRequestException(AppError.USER_NOT_FOUND);
      } else if (
        await this.userRepo.isMobileExistExceptId(data.mobile, data.userId)
      ) {
        throw new BadRequestException(
          AppError.UNIQUE_CONSTRAINT.replace('{0}', 'Mobile'),
        );
      } else if (
        await this.userRepo.isEmailExistExceptId(data.email, data.userId)
      ) {
        throw new BadRequestException(
          AppError.UNIQUE_CONSTRAINT.replace('{0}', 'Email'),
        );
      }

      await this.userRepo.updateUser(modifiedUserId, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
