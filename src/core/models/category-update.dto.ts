import { IsNotEmpty, IsNumber } from 'class-validator';

export class CategoryUpdateDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;
}
