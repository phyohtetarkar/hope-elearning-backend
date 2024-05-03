import { IsNotEmpty } from 'class-validator';

export class ResumeLessonUpdateDto {
  userId: string;

  @IsNotEmpty()
  courseId: string;

  @IsNotEmpty()
  lessonId: string;
}
