import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChapterEntity } from './chapter.entity';
import { CourseEntity } from './course.entity';

@Entity({ name: 'course_skill' })
export class CourseChapterEntity {
  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'chapter_id' })
  chapterId: number;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.chapters)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => ChapterEntity)
  @JoinColumn({ name: 'chapter_id' })
  chapter: ChapterEntity;
}
