import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class ChapterCreateDto {
  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsInt()
  sortOrder: number;
}
