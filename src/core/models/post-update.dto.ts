import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class PostUpdateDto {
  @IsInt()
  id: number;

  cover?: string;

  title?: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  lexical?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors?: string[];

  @IsOptional()
  @IsArray()
  tags?: number[];
}
