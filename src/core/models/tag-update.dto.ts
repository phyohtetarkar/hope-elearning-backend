import { IsNotEmpty, IsNumber } from 'class-validator';

export class TagUpdateDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;
}
