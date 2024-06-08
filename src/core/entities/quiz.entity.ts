import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizType } from '../models';
import { AuditingEntity } from './auditing.entity';
import { LessonEntity } from './lesson.entity';
import { QuizAnswerEntity } from './quiz-answer.entity';

@Entity({ name: 'quiz' })
export class QuizEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  question: string;

  @Column({
    type: 'enum',
    enum: QuizType,
    default: QuizType.MULTIPLE_CHOICE,
  })
  type: QuizType;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  feedback?: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => QuizAnswerEntity, (type) => type.quiz)
  answers: QuizAnswerEntity[];

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;
}
