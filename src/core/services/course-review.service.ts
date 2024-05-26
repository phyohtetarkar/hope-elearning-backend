import {
  CourseReviewDto,
  CourseReviewUpdateDto,
  PageDto,
  QueryDto,
} from '../models';

export interface CourseReviewService {
  save(values: CourseReviewUpdateDto): Promise<void>;

  remove(userId: string, courseId: number): Promise<void>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: number,
  ): Promise<CourseReviewDto | undefined>;

  findByCourseId(
    courseId: number,
    query: QueryDto,
  ): Promise<PageDto<CourseReviewDto>>;
}

export const COURSE_REVIEW_SERVICE = 'CourseReviewService';
