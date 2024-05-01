import { IsNotEmpty, Max, Min } from 'class-validator';

export class CourseReviewUpdateDto {
  userId: string;

  @IsNotEmpty()
  courseId: string;

  @Min(1)
  @Max(5)
  rating: number;

  message?: string;
}
