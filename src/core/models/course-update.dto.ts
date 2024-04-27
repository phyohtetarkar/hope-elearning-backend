import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CourseLevel } from './course.dto';

export class CourseUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  description?: string;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsInt()
  categoryId: number;

  @IsArray()
  @ArrayMinSize(1)
  authors: string[];

  @IsArray()
  @IsOptional()
  skills?: number[];
}
