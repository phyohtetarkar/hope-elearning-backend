import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class LessonUpdateDto {
  @IsNotEmpty()
  id: string;

  @Exclude()
  courseId: string;

  @IsOptional()
  @MaxLength(2000)
  title?: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  lexical?: string;

  trial?: boolean;

  @IsDateString()
  updatedAt: string;

  @ApiHideProperty()
  updatedBy: string;
}
