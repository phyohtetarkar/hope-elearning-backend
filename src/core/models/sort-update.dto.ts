import { IsInt, IsNumber } from 'class-validator';

export class SortUpdateDto {
  @IsNumber()
  id: number;

  @IsInt()
  sortOrder: number;
}
