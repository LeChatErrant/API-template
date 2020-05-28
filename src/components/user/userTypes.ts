import {
  IsEmail, IsOptional, IsString, MinLength, MaxLength,
} from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

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
  name!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsOptional()
  password!: string;
}
