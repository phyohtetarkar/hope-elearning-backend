import { IsNotEmpty } from 'class-validator';

export class TagCreateDto {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;
}
