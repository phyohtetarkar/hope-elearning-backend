import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class LessonCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  content: string;

  @IsInt()
  duration: number;

  @IsBoolean()
  completeStatus: boolean;
}
