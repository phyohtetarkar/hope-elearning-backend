import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizResponseDto } from '../models';
import { AuditingEntity } from './auditing.entity';
import { LessonEntity } from './lesson.entity';
import { QuizAnswerEntity } from './quiz-answer.entity';
import { QuizEntity } from './quiz.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'quiz_response' })
export class QuizResponseEntity extends AuditingEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: number;

  @PrimaryColumn({ name: 'quiz_id', type: 'bigint' })
  quizId: number;

  @PrimaryColumn({ name: 'answer_id', type: 'bigint' })
  answerId: number;

  @Column({
    name: 'short_answer',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  shortAnswer?: string | null;

  @ManyToOne(() => LessonEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  @ManyToOne(() => QuizEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz?: QuizEntity;

  @ManyToOne(() => QuizAnswerEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answer_id' })
  answer?: QuizAnswerEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  constructor(partial: Partial<QuizResponseEntity> = {}) {
    super();
    Object.assign(this, partial);
  }

  toDto() {
    return new QuizResponseDto({
      quizId: this.quizId,
      shortAnswer: this.shortAnswer ?? undefined,
      answer: this.answer?.toDto(),
    });
  }
}
