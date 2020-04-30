import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
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
  name!: string;

  @IsString()
  @IsOptional()
  password!: string;
}
