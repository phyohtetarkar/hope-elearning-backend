import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class LessonCreateDto {
  @IsNotEmpty()
  chapterId: string;

  @IsNotEmpty()
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
