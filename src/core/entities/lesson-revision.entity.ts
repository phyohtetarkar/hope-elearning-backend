import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChapterEntity } from './chapter.entity';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'lesson_revision' })
export class LessonRevisionEntity {
  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: string;

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

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  @ManyToOne(() => ChapterEntity)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: ChapterEntity;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
