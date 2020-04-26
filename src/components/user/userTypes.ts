import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserSignup {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  password!: string;
}

export class UserSignin {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class UserUpdate {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  password!: string;
}

