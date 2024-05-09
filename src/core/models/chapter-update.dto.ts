import { Exclude } from 'class-transformer';
import { IsDateString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChapterUpdateDto {
  @IsNotEmpty()
  id: string;

  @Exclude()
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
