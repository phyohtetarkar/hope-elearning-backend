import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
} from 'class-validator';

export class ChapterUpdateDto {
  @IsNumberString()
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
