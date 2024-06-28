import { ApiHideProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { CourseAccess, CourseLevel } from './course.dto';

export class CourseUpdateDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  cover?: string;

  excerpt?: string;

  description?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsEnum(CourseAccess)
  access?: CourseAccess;

  @IsNumber()
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
