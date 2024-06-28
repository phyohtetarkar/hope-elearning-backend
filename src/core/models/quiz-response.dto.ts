import { Transform } from 'class-transformer';
import { QuizAnswerDto } from './quiz-answer.dto';

export class QuizResponseDto {
  @Transform(({ value }) => Number(value))
  quizId: number;

  shortAnswer?: string;

  answer: QuizAnswerDto;

  constructor(partial: Partial<QuizResponseDto> = {}) {
    Object.assign(this, partial);
  }
}
