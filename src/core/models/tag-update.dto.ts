import { IsInt, IsNotEmpty } from 'class-validator';

export class TagUpdateDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;
}
