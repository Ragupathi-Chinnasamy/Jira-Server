import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]{1,29}$')
  @MinLength(1)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Matches('^[A-Za-z]{1,29}$')
  @MinLength(1)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Matches('^\\d{10}$')
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  roleId: number;
}

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;
}

export class GetUsersDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  page: number;

  @IsString()
  @IsOptional()
  search: string;
}
