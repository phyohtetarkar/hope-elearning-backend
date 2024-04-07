import { IsNotEmpty } from 'class-validator';

export class TagUpdateInput {
  id: number;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;
}
