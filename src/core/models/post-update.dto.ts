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
import { PostVisibility } from './post.dto';

export class PostUpdateDto {
  @IsNumber()
  id: number;

  cover?: string;

  @IsOptional()
  @MaxLength(2000)
  title?: string;

  @IsNotEmpty()
  @MaxLength(2000)
  slug: string;

  excerpt?: string;

  lexical?: string;

  html?: string;

  wordCount?: number;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors?: string[];

  @IsOptional()
  @IsArray()
  tags?: number[];

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsDateString()
  updatedAt: string;

  @ApiHideProperty()
  updatedBy: string;
}
