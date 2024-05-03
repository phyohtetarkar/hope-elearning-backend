import { CourseDto, PageDto, QueryDto } from '../models';

export interface BookmarkCourseService {
  add(userId: string, courseId: string): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  findByUserId(userId: string, query: QueryDto): Promise<PageDto<CourseDto>>;
}

export const BOOKMARK_COURSE_SERVICE = 'BookmarkCourseService';
