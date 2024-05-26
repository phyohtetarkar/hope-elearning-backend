import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class LessonUpdateDto {
  @IsNumber()
  id: number;

  @Exclude()
  courseId: number;

  @IsOptional()
  @MaxLength(2000)
  title?: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  lexical?: string;

  wordCount?: number;

  trial?: boolean;

  @IsDateString()
  updatedAt: string;

  @ApiHideProperty()
  updatedBy: string;
}
