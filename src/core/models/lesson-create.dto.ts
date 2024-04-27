import { IsNotEmpty } from 'class-validator';

export class LessonCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  lexical?: string;
}
