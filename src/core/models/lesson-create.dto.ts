import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class LessonCreateDto {
  @IsNumber()
  chapterId: number;

  @Exclude()
  courseId: number;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  lexical?: string;

  trial?: boolean;

  @IsInt()
  sortOrder: number;
}
