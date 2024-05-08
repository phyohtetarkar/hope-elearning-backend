import {
  CourseReviewDto,
  CourseReviewUpdateDto,
  PageDto,
  QueryDto,
} from '../models';

export interface CourseReviewService {
  save(values: CourseReviewUpdateDto): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseReviewDto | undefined>;

  findByCourseId(
    courseId: string,
    query: QueryDto,
  ): Promise<PageDto<CourseReviewDto>>;
}

export const COURSE_REVIEW_SERVICE = 'CourseReviewService';
