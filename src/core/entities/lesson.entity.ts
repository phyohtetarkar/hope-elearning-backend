import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonDto, LessonType } from '../models';
import { AuditingEntity } from './auditing.entity';
import { ChapterEntity } from './chapter.entity';
import { QuizEntity } from './quiz.entity';

@Entity({ name: 'lesson' })
export class LessonEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ default: false })
  trial: boolean;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.TEXT,
  })
  type: LessonType;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @Column({ type: 'text', nullable: true })
  html?: string | null;

  @Column({ name: 'word_count', default: 0 })
  wordCount: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => ChapterEntity, (type) => type.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapter_id' })
  chapter?: ChapterEntity;

  @OneToMany(() => QuizEntity, (type) => type.lesson)
  quizzes?: QuizEntity[];

  toDto(compact?: boolean): LessonDto {
    if (compact) {
      return new LessonDto({
        id: this.id,
        title: this.title,
        slug: this.slug,
        trial: this.trial,
        wordCount: this.wordCount,
        sortOrder: this.sortOrder,
        type: this.type,
        audit: this.toAudit(),
      });
    }

    return new LessonDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      trial: this.trial,
      type: this.type,
      lexical: this.lexical ?? undefined,
      wordCount: this.wordCount,
      sortOrder: this.sortOrder,
      chapter: this.chapter?.toDto(true),
      quizzes: this.quizzes
        ?.sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.createdAt.getTime() - b.createdAt.getTime();
          }
          return a.sortOrder - b.sortOrder;
        })
        .map((q) => q.toDto()),
      audit: this.toAudit(),
    });
  }
}
