import { Exclude } from 'class-transformer';
import { IsInt, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class CourseReviewUpdateDto {
  @Exclude()
  userId: string;

  @Exclude()
  courseId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @MaxLength(5000)
  message?: string;
}
