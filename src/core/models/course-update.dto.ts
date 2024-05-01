import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { CourseAccess, CourseLevel } from './course.dto';

export class CourseUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  cover?: string;

  excerpt?: string;

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
