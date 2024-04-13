import { PageDto } from '../models';
import { LessonCreateDto } from '../models/lesson-create.dto';
import { LessonQueryDto } from '../models/lesson-query-dto';
import { LessonUpdateDto } from '../models/lesson-update.dto';
import { LessonDto } from '../models/lesson.dto';

export interface LessonService {
  create(values: LessonCreateDto): Promise<number>;

  update(values: LessonUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<LessonDto | null>;

  find(query: LessonQueryDto): Promise<PageDto<LessonDto>>;
}

export const LESSON_SERVICE = 'LessonService';
