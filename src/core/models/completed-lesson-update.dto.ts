import { IsNotEmpty } from 'class-validator';

export class CompletedLessonUpdateDto {
  userId: string;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  lessonId: string;
}
