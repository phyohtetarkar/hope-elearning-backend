import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonDto, LessonStatus, LessonType } from '../models';
import { AuditingEntity } from './auditing.entity';
import { ChapterEntity } from './chapter.entity';
import { CourseEntity } from './course.entity';

@Entity({ name: 'lesson' })
export class LessonEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ default: false })
  trial: boolean;

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  status: LessonStatus;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.TEXT,
  })
  type: LessonType;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'course_id', type: 'bigint' })
  courseId: string;

  @Column({ name: 'chapter_id', type: 'bigint' })
  chapterId: string;

  @ManyToOne(() => ChapterEntity, (type) => type.lessons)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: ChapterEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  toDto(compact?: boolean) {
    if (compact) {
      return new LessonDto({
        id: this.id,
        title: this.title,
        slug: this.slug,
        trial: this.trial,
        sortOrder: this.sortOrder,
        status: this.status,
        type: this.type,
        courseId: this.courseId,
        chapterId: this.chapterId,
        audit: this.toAudit(),
      });
    }

    return new LessonDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      trial: this.trial,
      status: this.status,
      type: this.type,
      lexical: this.lexical ?? undefined,
      sortOrder: this.sortOrder,
      courseId: this.courseId,
      chapterId: this.chapterId,
      chapter: this.chapter?.toDto(true),
      course: this.course?.toDto(true),
      audit: this.toAudit(),
    });
  }
}
