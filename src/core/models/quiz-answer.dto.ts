import { Expose, Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';

export class QuizAnswerDto {
  @Transform(({ value }) => Number(value))
  id: number;

  answer: string;

  correct: boolean;

  sortOrder: number;

  audit?: AuditingDto;

  @Expose({
    toClassOnly: true,
  })
  deleted?: boolean;

  constructor(partial: Partial<QuizAnswerDto> = {}) {
    Object.assign(this, partial);
  }
}
