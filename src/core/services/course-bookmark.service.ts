import { CourseDto, PageDto, QueryDto } from '../models';

export interface CourseBookmarkService {
  add(userId: string, courseId: string): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  existsByUserIdAndCourseId(userId: string, courseId: string): Promise<boolean>;

  countByUser(userId: string): Promise<number>;

  findByUserId(userId: string, query: QueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_BOOKMARK_SERVICE = 'CourseBookmarkService';
