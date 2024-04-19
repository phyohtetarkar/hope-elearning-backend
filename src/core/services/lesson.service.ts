import {
  LessonCreateDto,
  LessonDto,
  LessonQueryDto,
  LessonUpdateDto,
  PageDto,
} from '../models';

export interface LessonService {
  create(values: LessonCreateDto): Promise<number>;

  update(values: LessonUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<LessonDto | null>;

  find(query: LessonQueryDto): Promise<PageDto<LessonDto>>;
}

export const LESSON_SERVICE = 'LessonService';
