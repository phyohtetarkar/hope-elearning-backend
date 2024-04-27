import {
  LessonCreateDto,
  LessonDto,
  LessonUpdateDto,
  PageDto,
  QueryDto,
} from '../models';

export interface LessonService {
  create(values: LessonCreateDto): Promise<number>;

  update(values: LessonUpdateDto): Promise<number>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<LessonDto | null>;

  findBySlug(slug: string): Promise<LessonDto | null>;

  find(query: QueryDto): Promise<PageDto<LessonDto>>;
}

export const LESSON_SERVICE = 'LessonService';
