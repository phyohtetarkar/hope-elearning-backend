import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class PostCreateDto {
  cover?: string;

  @IsOptional()
  @MaxLength(2000)
  title?: string;

  @IsNotEmpty()
  @MaxLength(2000)
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
