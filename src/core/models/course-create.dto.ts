import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CourseLevel } from './course.dto';

export class CourseCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  description?: string;

  @IsNotEmpty()
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
