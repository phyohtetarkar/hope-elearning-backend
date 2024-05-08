import { CourseDto, PageDto, QueryDto } from '../models';

export interface BookmarkCourseService {
  add(userId: string, courseId: string): Promise<void>;

  remove(userId: string, courseId: string): Promise<void>;

  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<CourseDto | undefined>;

  findByUserId(userId: string, query: QueryDto): Promise<PageDto<CourseDto>>;
}

export const BOOKMARK_COURSE_SERVICE = 'BookmarkCourseService';
