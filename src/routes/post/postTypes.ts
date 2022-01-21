import { IsOptional, IsString, MaxLength } from 'class-validator';

import { Ro } from '../../appRo';

export class PostCreateDto {
  @IsString()
  @MaxLength(50)
  title!: string;

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
  content?: string;
}

export interface PostRo extends Ro {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
