import { IsNotEmpty } from 'class-validator';

export class EnrollCourseDto {
  userId: string;

  @IsNotEmpty()
  courseId: string;
}
