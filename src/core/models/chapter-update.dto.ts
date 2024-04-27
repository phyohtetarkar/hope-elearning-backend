import { IsNotEmpty } from 'class-validator';

export class ChapterUpdateDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;
}
