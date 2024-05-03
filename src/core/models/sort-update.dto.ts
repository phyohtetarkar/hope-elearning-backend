import { IsInt, IsNotEmpty } from 'class-validator';

export class SortUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsInt()
  sortOrder: number;
}
