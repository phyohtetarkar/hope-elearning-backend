import { IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class CourseReviewUpdateDto {
  userId: string;

  @IsNotEmpty()
  courseId: string;

  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @MaxLength(5000)
  message?: string;
}
