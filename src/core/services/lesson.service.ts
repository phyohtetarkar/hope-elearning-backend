import {
  LessonCreateDto,
  LessonDto,
  LessonUpdateDto,
  SortUpdateDto,
} from '../models';

export interface LessonService {
  create(values: LessonCreateDto): Promise<number>;

  update(values: LessonUpdateDto): Promise<void>;

  updateSort(values: SortUpdateDto[]): Promise<void>;

  delete(courseId: number, lessonId: number): Promise<void>;

  findById(id: number): Promise<LessonDto | undefined>;

  findBySlug(slug: string): Promise<LessonDto | undefined>;
}

export const LESSON_SERVICE = 'LessonService';
