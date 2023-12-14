import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@src/repositories/user.repository';
import { PrismaService } from '@src/database/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, PrismaService],
})
export class AuthModule {}
