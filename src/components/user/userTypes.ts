import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @MinLength(8)
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
  @MinLength(8)
  @IsOptional()
  password!: string;
}
