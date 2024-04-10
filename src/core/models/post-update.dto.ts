import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class PostUpdateDto {
  @IsInt()
  id: number;

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

  tags?: number[];
}
