import {
  LessonCreateDto,
  LessonDto,
  LessonUpdateDto,
  SortUpdateDto,
} from '../models';

export interface LessonService {
  create(values: LessonCreateDto): Promise<string>;

  update(values: LessonUpdateDto): Promise<LessonDto>;

  updateSort(values: [SortUpdateDto]): Promise<void>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<LessonDto | undefined>;

  findBySlug(slug: string): Promise<LessonDto | undefined>;
}

export const LESSON_SERVICE = 'LessonService';
