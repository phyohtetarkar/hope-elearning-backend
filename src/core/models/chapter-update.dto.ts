import { IsInt, IsNotEmpty } from 'class-validator';

export class ChapterUpdateDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  name: string;
}
