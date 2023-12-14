import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { config } from '@src/config';
import { PrismaService } from '@src/database/prisma.service';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization?.split(' ')[1];

      if (token) {
        const verificationResponse: any = verify(token, config.JWT_SECRET_KEY);

        if (verificationResponse) {
          const user = await this.prismaService.user.findFirst({
            where: {
              id: +verificationResponse?.id,
              isActive: true,
              token: token,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
              token: true,
              role: { select: { id: true, role: true } },
            },
          });
          req.user = { ...user };
          return true;
        } else {
          throw new HttpException('Wrong authentication token', 401);
        }
      } else {
        throw new HttpException('Authentication token missing', 401);
      }
    } catch (error) {
      throw new HttpException('Error: ' + error.message, 401);
    }
  }
}
