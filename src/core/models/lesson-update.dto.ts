import { IsNotEmpty } from 'class-validator';

export class LessonUpdateDto {
  @IsNotEmpty()
  id: string;

  title?: string;

  @IsNotEmpty()
  slug: string;

  lexical?: string;
}
