import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class LessonCreateDto {
  @IsNotEmpty()
  chapterId: string;

  @Exclude()
  courseId: string;

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
