import { IsNotEmpty } from 'class-validator';

export class ChapterCreateDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  slug: string;
}
