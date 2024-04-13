import { IsNotEmpty } from 'class-validator';

export class ChapterCreateDto {
  @IsNotEmpty()
  name: string;
}
