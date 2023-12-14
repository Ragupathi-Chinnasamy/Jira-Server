import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  projectId: number;
}

export class GetProjectDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  page: number;

  @IsString()
  @IsOptional()
  search: string;
}
