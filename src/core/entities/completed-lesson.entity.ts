import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EnrolledCourseEntity } from './enrolled-course.entity';
import { LessonEntity } from './lesson.entity';
import { ChapterEntity } from './chapter.entity';

@Entity({ name: 'completed_lesson' })
export class CompletedLessonEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: string;

  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: string;

  @Column({ name: 'chapter_id', type: 'bigint' })
  chapterId: string;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  @ManyToOne(() => ChapterEntity)
  @JoinColumn({ name: 'chapter_id' })
  chapter?: ChapterEntity;

  @ManyToOne(() => EnrolledCourseEntity, (type) => type.completedLessons)
  @JoinColumn([
    { name: 'user_id', referencedColumnName: 'userId' },
    { name: 'course_id', referencedColumnName: 'courseId' },
  ])
  course?: EnrolledCourseEntity;
}
