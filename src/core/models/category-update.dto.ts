import { IsInt, IsNotEmpty } from 'class-validator';

export class CategoryUpdateDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  name: string;
}
