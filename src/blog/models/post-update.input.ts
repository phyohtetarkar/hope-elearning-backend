import { IsNotEmpty } from 'class-validator';

export class PostUpdateInput {
  id: number;

  cover?: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;

  excerpt?: string;

  body?: string;

  @IsNotEmpty()
  authorId: string;

  tags?: number[];
}
