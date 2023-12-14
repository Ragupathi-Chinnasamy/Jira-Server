import { DashboardModule } from '@module/dashboard/dashboard.module';
import { ProjectModule } from '@module/project/project.module';
import { TaskModule } from '@module/task/task.module';
import { UserModule } from '@module/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '@src/database/prisma.service';
import { AuthModule } from '@module/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppRepository } from '@src/repositories/app.respository';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TaskModule,
    DashboardModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), './public/task'),
      serveRoot: '/api/task',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppRepository],
})
export class AppModule {}
