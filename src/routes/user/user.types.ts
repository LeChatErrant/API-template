import { Role } from '@prisma/client';
import {
  IsEmail, IsOptional, IsString, MinLength, MaxLength,
} from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
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
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsOptional()
  password?: string;
}

export interface UserRo {
  id: string;
  email: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
