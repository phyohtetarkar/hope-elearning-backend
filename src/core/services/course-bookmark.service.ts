import { CourseDto, PageDto, QueryDto } from '../models';

export interface CourseBookmarkService {
  add(userId: string, courseId: number): Promise<void>;

  remove(userId: string, courseId: number): Promise<void>;

  existsByUserIdAndCourseId(userId: string, courseId: number): Promise<boolean>;

  countByUser(userId: string): Promise<number>;

  findByUserId(userId: string, query: QueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_BOOKMARK_SERVICE = 'CourseBookmarkService';
