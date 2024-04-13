import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class LessonUpdateDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  content: string;

  @IsInt()
  duration: number;

  @IsBoolean()
  completeStatus: boolean;
}
