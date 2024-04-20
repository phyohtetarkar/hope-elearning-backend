import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class PostCreateDto {
  cover?: string;

  title?: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  lexical?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Required at least one author' })
  authors: string[];

  @IsOptional()
  @IsArray()
  tags?: number[];
}
