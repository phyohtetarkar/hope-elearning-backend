import { LessonDto } from '../models';

export interface LessonRevisionService {
  save(oldLesson: LessonDto, newLesson: LessonDto): Promise<void>;

  //   findByLessonId(postId: string): Promise<PageDto<LessonDto>>;
}

export const LESSON_REVISION_SERVICE = 'LessonRevisionService';
