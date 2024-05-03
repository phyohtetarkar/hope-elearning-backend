import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { LessonStatus } from './lesson.dto';

export class LessonUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @MaxLength(2000)
  title?: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  lexical?: string;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;

  @IsDateString()
  updatedAt: string;
}
