import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseUpdateDto,
  PageDto,
} from '../models';

export interface CourseService {
  create(values: CourseCreateDto): Promise<number>;

  update(values: CourseUpdateDto): Promise<void>;

  publish(userId: string, courseId: number): Promise<void>;

  unpublish(courseId: number): Promise<void>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<CourseDto | undefined>;

  findBySlug(slug: string): Promise<CourseDto | undefined>;

  findRelated(slug: string, limit: number): Promise<CourseDto[]>;

  find(query: CourseQueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_SERVICE = 'CourseService';
