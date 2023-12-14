import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from '@src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async signIn(@Body() credentials: LoginAuthDto) {
    try {
      return {
        message: 'User logged in successfully',
        data: await this.service.signIn(credentials),
      };
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'something went wrong',
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
