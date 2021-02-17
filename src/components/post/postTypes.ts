import { IsString, MaxLength } from 'class-validator';
import { Ro } from '../../appRo';

export class NewPostDto {
  @IsString()
  @MaxLength(50)
  title!: string;

  @IsString()
  content!: string;
}

export interface PostRo extends Ro {
  id: string;
  authorId: string;
  createdAt: Date;
  title: string;
  content: string;
}
