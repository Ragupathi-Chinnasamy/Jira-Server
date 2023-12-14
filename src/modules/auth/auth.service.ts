import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from '@src/dto/auth.dto';
import { UserRepository } from '@src/repositories/user.repository';
import { generateWebToken } from '@src/utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async signIn(credentials: LoginAuthDto) {
    try {
      const user = await this.userRepo.findUserByEmail(credentials.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const passwordMatched = await bcrypt.compare(
        credentials.password,
        user.userPasswords[0].password,
      );

      if (!passwordMatched) {
        throw new UnauthorizedException('Password does not match');
      }

      const token = await generateWebToken(user.id);

      const userWithToken = await this.userRepo.updateUserToken(user.id, token);

      return userWithToken;
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'something went wrong',
        error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
