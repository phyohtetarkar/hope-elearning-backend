import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { PostAccess } from './post.dto';

export class PostUpdateDto {
  @IsInt()
  id: number;

  cover?: string;

  title?: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  lexical?: string;

  @IsEnum(PostAccess)
  access: PostAccess;

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
