import { Exclude } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { LessonType } from './lesson.dto';

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

  @IsEnum(LessonType)
  type: LessonType;

  lexical?: string;

  trial?: boolean;

  @IsInt()
  sortOrder: number;
}
