import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuizDto, QuizType } from '../models';
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

  @ManyToOne(() => LessonEntity, (type) => type.quizzes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  toDto() {
    return new QuizDto({
      id: this.id,
      question: this.question,
      type: this.type,
      feedback: this.feedback ?? undefined,
      sortOrder: this.sortOrder,
      answers: this.answers
        .sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.createdAt.getTime() - b.createdAt.getTime();
          }
          return a.sortOrder - b.sortOrder;
        })
        .map((a) => a.toDto()),
      audit: this.toAudit(),
    });
  }
}
