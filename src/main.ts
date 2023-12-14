import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@src/filters/exception.filter';
import { AppModule } from '@module/app/app.module';
import { config } from '@src/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.enableCors({});
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  await app.listen(config.port ?? 3001);
  Logger.debug(
    `Application is running on: ${await app.getUrl()}`,
    bootstrap.name,
  );
}

bootstrap();
