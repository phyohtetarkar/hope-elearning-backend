import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChapterDto } from '../models';
import { AuditingEntity } from './auditing.entity';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';

@Entity({ name: 'chapter' })
export class ChapterEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.chapters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  @OneToMany(() => LessonEntity, (type) => type.chapter)
  lessons?: LessonEntity[];

  toDto(compact?: boolean) {
    if (compact) {
      return new ChapterDto({
        id: this.id,
        title: this.title,
        slug: this.slug,
        sortOrder: this.sortOrder,
        course: this.course?.toDto(true),
        // lessons: this.lessons
        //   ?.sort((a, b) => a.sortOrder - b.sortOrder)
        //   .map((e) => e.toDto(true)),
        audit: this.toAudit(),
      });
    }
    return new ChapterDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      sortOrder: this.sortOrder,
      // course: this.course?.toDto(true),
      lessons: this.lessons
        ?.sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.createdAt.getTime() - b.createdAt.getTime();
          }
          return a.sortOrder - b.sortOrder;
        })
        .map((e) => e.toDto(true)),
      audit: this.toAudit(),
    });
  }
}
