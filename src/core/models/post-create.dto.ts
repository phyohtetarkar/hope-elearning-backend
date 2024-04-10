import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class PostCreateDto {
  cover?: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  lexical?: string;

  @IsArray()
  @ArrayMinSize(1)
  authors: string[];

  @IsArray()
  tags?: number[];
}
