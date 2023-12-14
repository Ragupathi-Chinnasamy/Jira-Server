import { Role } from '@src/enum';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { roles, taskStatus, taskType } from '@src/utils';

async function initRoles(prisma: PrismaService) {
  const roleCount = await prisma.role.count({});
  if (roleCount == 0) {
    console.log('Default roles not found...creating roles');
    for (const role of roles) {
      await prisma.role.create({
        data: {
          role: role,
        },
      });
    }
    console.log('Default roles created successfully');
  }
}

async function initAdmin(prisma: PrismaService) {
  const userCount = await prisma.user.count({});
  const hashedPassword = await bcrypt.hash('Sterna@123', 10);
  if (userCount === 0) {
    console.log('Default user not found...creating user');
    await prisma.user.create({
      data: {
        firstName: 'Ragupathi',
        lastName: 'C',
        email: 'ragupathic@sternadevices.in',
        mobile: '9500985620',
        roleId: Role.Admin,
        userPasswords: {
          create: {
            password: hashedPassword,
          },
        },
      },
    });
    console.log('Default user created successfully');
  }
}

async function initTaskType(prisma: PrismaService) {
  const typeCount = await prisma.taskType.count({});
  if (typeCount == 0) {
    console.log('Default task type not found...creating task type');
    for (const type of taskType) {
      await prisma.taskType.create({
        data: {
          type,
        },
      });
    }
    console.log('Default task type created successfully');
  }
}

async function initTaskStatus(prisma: PrismaService) {
  const taskStatusCount = await prisma.taskStatus.count({});
  if (taskStatusCount == 0) {
    console.log('Default task status not found...creating task status');
    for (const status of taskStatus) {
      await prisma.taskStatus.create({
        data: {
          status,
        },
      });
    }
    console.log('Default task status created successfully');
  }
}

async function initDatabase(prisma: PrismaService) {
  try {
    await initRoles(prisma);
    await initAdmin(prisma);
    await initTaskType(prisma);
    await initTaskStatus(prisma);
  } catch (error) {
    console.error(error);
  }
}

export default initDatabase;
