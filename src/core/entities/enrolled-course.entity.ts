import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { EnrolledCourseDto } from '../models';
import { AuditingEntity } from './auditing.entity';
import { CompletedLessonEntity } from './completed-lesson.entity';
import { CourseEntity } from './course.entity';
import { LessonEntity } from './lesson.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'enrolled_course' })
export class EnrolledCourseEntity extends AuditingEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => LessonEntity, { nullable: true })
  @JoinColumn({ name: 'resume_lesson_id' })
  resumeLesson?: LessonEntity | null;

  @OneToMany(() => CompletedLessonEntity, (type) => type.course)
  completedLessons?: CompletedLessonEntity[];

  toDto(compact?: boolean) {
    if (compact) {
      return new EnrolledCourseDto({
        course: this.course.toDto(true),
        resumeLesson: this.resumeLesson?.toDto(true),
      });
    }
    return new EnrolledCourseDto({
      course: this.course.toDto(),
      completedLessons: this.completedLessons?.map((l) => Number(l.lessonId)),
      resumeLesson: this.resumeLesson?.toDto(true),
    });
  }
}
