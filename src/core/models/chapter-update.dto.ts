import { IsDateString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChapterUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  @IsDateString()
  updatedAt: string;
}
