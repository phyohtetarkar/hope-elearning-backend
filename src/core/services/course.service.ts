import { PageDto } from '../models';
import { CourseCreateDto } from '../models/course-create.dto';
import { CourseQueryDto } from '../models/course-query.dto';
import { CourseUpdateDto } from '../models/course-update.dto';
import { CourseDto } from '../models/course.dto';

export interface CourseService {
  create(values: CourseCreateDto): Promise<number>;

  update(values: CourseUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<CourseDto | null>;

  find(query: CourseQueryDto): Promise<PageDto<CourseDto>>;
}

export const COURSE_SERVICE = 'CourseService';
