import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { CourseMetaDto } from '../models';

@Entity({ name: 'course_meta' })
export class CourseMetaEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0.0 })
  rating: string;

  @Column({ name: 'rating_count', type: 'bigint', default: 0 })
  ratingCount: string;

  @Column({ name: 'enrolled_count', type: 'bigint', default: 0 })
  enrolledCount: string;

  @Column({ name: 'chapter_count', default: 0 })
  chapterCount: number;

  @Column({ name: 'lesson_count', default: 0 })
  lessonCount: number;

  @OneToOne(() => CourseEntity, (type) => type.meta)
  @JoinColumn({ name: 'id' })
  course?: CourseEntity;

  toDto() {
    return new CourseMetaDto({
      rating: this.rating,
      ratingCount: this.ratingCount,
      enrolledCount: this.enrolledCount,
      chapterCount: this.chapterCount,
      lessonCount: this.lessonCount,
    });
  }
}
