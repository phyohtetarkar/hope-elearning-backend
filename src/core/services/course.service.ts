import {
  CourseCreateDto,
  CourseDto,
  CourseQueryDto,
  CourseUpdateDto,
  PageDto,
} from '../models';

export interface CourseService {
  create(values: CourseCreateDto): Promise<number>;

  update(values: CourseUpdateDto): Promise<number>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<CourseDto | null>;

  findBySlug(slug: string): Promise<CourseDto | null>;

  find(query: CourseQueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_SERVICE = 'CourseService';
