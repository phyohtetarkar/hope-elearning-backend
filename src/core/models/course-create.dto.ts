import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { CourseAccess, CourseLevel } from './course.dto';

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

  @IsEnum(CourseAccess)
  access: CourseAccess;

  @IsInt()
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors: string[];
}
