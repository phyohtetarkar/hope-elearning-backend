import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { CourseLevel } from './course.dto';

export class CourseCreateDto {
  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  description?: string;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors: string[];
}
