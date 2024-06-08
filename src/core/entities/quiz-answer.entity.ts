import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizAnswerDto } from '../models';
import { AuditingEntity } from './auditing.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'quiz_answer' })
export class QuizAnswerEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  answer: string;

  @Column({ default: false })
  correct: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => QuizEntity, (type) => type.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz?: QuizEntity;

  toDto() {
    return new QuizAnswerDto({
      id: this.id,
      answer: this.answer,
      correct: this.correct,
      sortOrder: this.sortOrder,
      audit: this.toAudit(),
    });
  }
}
