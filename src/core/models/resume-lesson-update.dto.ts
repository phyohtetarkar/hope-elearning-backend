import { IsNumber } from 'class-validator';

export class ResumeLessonUpdateDto {
  userId: string;

  @IsNumber()
  courseId: number;

  @IsNumber()
  lessonId: number;
}
