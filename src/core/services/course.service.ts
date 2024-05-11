import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseUpdateDto,
  PageDto,
} from '../models';

export interface CourseService {
  create(values: CourseCreateDto): Promise<string>;

  update(values: CourseUpdateDto): Promise<void>;

  publish(userId: string, courseId: string): Promise<void>;

  unpublish(courseId: string): Promise<void>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<CourseDto | undefined>;

  findBySlug(slug: string): Promise<CourseDto | undefined>;

  findRelated(slug: string, limit: number): Promise<CourseDto[]>;

  find(query: CourseQueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_SERVICE = 'CourseService';
