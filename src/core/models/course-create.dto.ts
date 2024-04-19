import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CourseCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  category: number;

  @IsArray()
  @ArrayMinSize(1)
  authors: string[];

  @IsArray()
  @ArrayMinSize(1)
  skills: number[];

  @IsArray()
  @ArrayMinSize(1)
  chapters: number[];
}
