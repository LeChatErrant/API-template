import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostCreateDto {
  @IsString()
  @MaxLength(50)
  title!: string;

  @IsString()
  @IsOptional()
  imageLink?: string;

  @IsString()
  content!: string;
}

export class PostUpdateDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  imageLink?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export interface PostRo {
  id: string;
  authorId: string;
  title: string;
  imageLink: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
