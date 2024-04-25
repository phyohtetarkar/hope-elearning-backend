import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PostVisibility } from './post.dto';

export class PostUpdateDto {
  @IsNumber()
  id: number;

  cover?: string;

  title?: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  lexical?: string;

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

  @IsDateString()
  updatedAt: string;
}
