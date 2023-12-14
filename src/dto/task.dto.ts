import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  projectId: number;

  @IsNumberString({}, { each: true })
  taskAssigneeId: number[];

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  typeId: number;
}

export class UpdateTaskDto extends OmitType(CreateTaskDto, [
  'projectId',
] as const) {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  taskId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  statusId: number;
}

export class GetTasktDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  page: number;

  @IsString()
  @IsOptional()
  search: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  projectId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  typeId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  statusId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  assigneeId: number;
}
