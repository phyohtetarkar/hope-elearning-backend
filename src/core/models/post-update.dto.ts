import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { PostVisibility } from './post.dto';

export class PostUpdateDto {
  @IsNotEmpty()
  id: string;

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
