import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class LessonCreateDto {
  @IsNotEmpty()
  chapterId: string;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  lexical?: string;

  @IsInt()
  sortOrder: number;
}
