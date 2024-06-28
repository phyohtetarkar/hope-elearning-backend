import { QuizResponseCreateDto, QuizResponseDto } from '../models';

export interface QuizResponseService {
  create(
    userId: string,
    lessonId: number,
    responses: QuizResponseCreateDto[],
  ): Promise<QuizResponseDto[]>;

  deleteByLesson(userId: string, lessonId: number): Promise<void>;

  findByLesson(userId: string, lessonId: number): Promise<QuizResponseDto[]>;
}

export const QUIZ_RESPONSE_SERVICE = 'QuizResponseService';
