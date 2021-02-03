import {
  IsEmail, IsOptional, IsString, MinLength, MaxLength,
} from 'class-validator';
import { Role } from '@prisma/client';

import { Ro } from '../../appRo';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}

export class UserSigninDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class UserUpdateDto {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsString()
  @IsOptional()
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsOptional()
  password!: string;
}

export interface UserRo extends Ro {
  id: string;
  email: string;
  username: string | null;
  role: Role;
  createdAt: Date;
}
