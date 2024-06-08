import { Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { QuizAnswerDto } from './quiz-answer.dto';

export enum QuizType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
}

export class QuizDto {
  @Transform(({ value }) => Number(value))
  id: number;

  question: string;

  type: QuizType;

  feedback?: string;

  sortOrder: number;

  answers: QuizAnswerDto[];

  audit?: AuditingDto;

  constructor(partial: Partial<QuizDto> = {}) {
    Object.assign(this, partial);
  }
}
