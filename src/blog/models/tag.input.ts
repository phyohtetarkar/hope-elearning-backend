import { IsNotEmpty } from 'class-validator';

export class TagInput {
  id: number;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;
}
