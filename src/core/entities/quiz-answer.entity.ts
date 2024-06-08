import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToOne(() => QuizEntity, (type) => type.answers)
  @JoinColumn({ name: 'quiz_id' })
  quiz?: QuizEntity;
}
