import { ApiHideProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { CourseAccess, CourseLevel } from './course.dto';

export class CourseUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  cover?: string;

  excerpt?: string;

  description?: string;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsOptional()
  @IsEnum(CourseAccess)
  access?: CourseAccess;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors?: string[];

  @IsDateString()
  updatedAt: string;

  @ApiHideProperty()
  updatedBy: string;
}
