import { IsNumber } from 'class-validator';

export class CompletedLessonUpdateDto {
  userId: string;

  @IsNumber()
  courseId: number;

  @IsNumber()
  lessonId: number;
}
