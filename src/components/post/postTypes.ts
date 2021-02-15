import { IsString, MaxLength } from 'class-validator';

export class NewPostDto {
  @IsString()
  @MaxLength(50)
  title!: string;

  @IsString()
  content!: string;
}
