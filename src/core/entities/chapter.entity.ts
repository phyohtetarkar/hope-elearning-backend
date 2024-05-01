import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';
import { ChapterDto } from '../models';

@Entity({ name: 'chapter' })
export class ChapterEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.chapters)
  course?: CourseEntity;

  @OneToMany(() => LessonEntity, (type) => type.chapter)
  lessons?: LessonEntity[];

  toDto() {
    return new ChapterDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      sortOrder: this.sortOrder,
      course: this.course?.toDto(),
      lessons: this.lessons
        ?.sort((a, b) => a.sortOrder - b.sortOrder)
        .map((e) => e.toDto()),
      audit: this.toAudit(),
    });
  }
}
