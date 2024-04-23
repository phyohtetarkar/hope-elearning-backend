import { IsNotEmpty } from 'class-validator';

export class CategoryCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;
}
