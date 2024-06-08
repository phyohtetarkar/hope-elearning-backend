import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EnrolledCourseEntity } from './enrolled-course.entity';
import { LessonEntity } from './lesson.entity';

@Entity({ name: 'completed_lesson' })
export class CompletedLessonEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'lesson_id', type: 'bigint' })
  lessonId: number;

  @ManyToOne(() => LessonEntity)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: LessonEntity;

  @ManyToOne(() => EnrolledCourseEntity, (type) => type.completedLessons)
  @JoinColumn([
    { name: 'user_id', referencedColumnName: 'userId' },
    { name: 'course_id', referencedColumnName: 'courseId' },
  ])
  course?: EnrolledCourseEntity;
}
