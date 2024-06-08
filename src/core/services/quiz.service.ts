import { QuizDto, QuizUpdateDto } from '../models';

export interface QuizService {
  create(values: QuizUpdateDto): Promise<QuizDto>;

  update(values: QuizUpdateDto): Promise<QuizDto>;

  delete(quizId: number, courseId: number): Promise<void>;

  findById(id: number): Promise<QuizDto | undefined>;
}

export const QUIZ_SERVICE = 'QuizService';
