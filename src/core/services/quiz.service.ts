import { QuizDto, QuizUpdateDto, SortUpdateDto } from '../models';

export interface QuizService {
  create(values: QuizUpdateDto): Promise<QuizDto>;

  update(values: QuizUpdateDto): Promise<QuizDto>;

  updateSort(values: SortUpdateDto[]): Promise<void>;

  delete(quizId: number, courseId: number): Promise<void>;

  findById(id: number): Promise<QuizDto | undefined>;
}

export const QUIZ_SERVICE = 'QuizService';
