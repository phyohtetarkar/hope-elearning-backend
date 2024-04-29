import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';
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
}
