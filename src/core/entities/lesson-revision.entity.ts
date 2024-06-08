import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'lesson_revision' })
export class LessonRevisionEntity {
  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: number;

  @PrimaryColumn({ name: 'author_id' })
  authorId: string;

  @PrimaryColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 2000 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
