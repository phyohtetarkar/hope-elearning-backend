import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class ChapterCreateDto {
  @Exclude()
  courseId: number;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  @IsInt()
  sortOrder: number;
}
