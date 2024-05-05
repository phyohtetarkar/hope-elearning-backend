import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class ChapterCreateDto {
  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  @IsInt()
  sortOrder: number;
}
