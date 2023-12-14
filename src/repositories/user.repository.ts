import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/database/prisma.service';
import { CreateUserDto, UpdateUserDto } from '@src/dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaService) {}

  async findUserByEmail(email: string) {
    try {
      return await this.db.user.findFirst({
        where: {
          email,
        },
        include: {
          userPasswords: {
            where: {
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'something went wrong',
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserToken(userId: number, token: string) {
    return await this.db.user.update({
      where: { id: userId },
      data: {
        token,
      },
      include: {
        role: true,
      },
    });
  }

  async findUsersCount(filter: Prisma.UserWhereInput) {
    return await this.db.user.count({
      where: filter,
    });
  }

  async findUsers(skip: number, take: number, filter: Prisma.UserWhereInput) {
    return await this.db.user.findMany({
      skip,
      take,
      where: filter,
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        createdProjects: {
          where: { isActive: true },
        },
        role: {
          select: {
            id: true,
            role: true,
          },
        },
        tasks: {
          where: {
            isActive: true,
          },
        },
        modifiedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async isEmailExist(email: string) {
    return (
      (await this.db.user.count({
        where: {
          email,
          isActive: true,
        },
      })) > 0
    );
  }

  async isMobileExist(mobile: string) {
    return (
      (await this.db.user.count({
        where: {
          mobile,
          isActive: true,
        },
      })) > 0
    );
  }

  async createUser(
    data: CreateUserDto,
    password: string,
    createdUserId: number,
  ) {
    await this.db.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        createdUserId,
        roleId: data.roleId,
        userPasswords: {
          create: {
            password,
          },
        },
      },
    });
  }

  async findUserById(id: number) {
    return await this.db.user.findFirst({
      where: {
        id,
      },
    });
  }

  async isEmailExistExceptId(email: string, userId: number) {
    return (
      (await this.db.user.count({
        where: {
          email,
          isActive: true,
          id: {
            not: userId,
          },
        },
      })) > 0
    );
  }

  async isMobileExistExceptId(mobile: string, userId: number) {
    return (
      (await this.db.user.count({
        where: {
          mobile,
          isActive: true,
          id: {
            not: userId,
          },
        },
      })) > 0
    );
  }

  async updateUser(
    modifiedUserId: number,
    { email, firstName, lastName, mobile, roleId, userId }: UpdateUserDto,
  ) {
    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        email,
        firstName,
        lastName,
        mobile,
        roleId,
        modifiedUserId,
      },
    });
  }
}
