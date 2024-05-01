import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CompletedLessonEntity } from './completed-lesson.entity';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';
import { EnrolledCourseDto } from '../models';

@Entity({ name: 'enrolled_course' })
export class EnrolledCourseEntity extends AuditingEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @OneToMany(() => CompletedLessonEntity, (type) => type.course)
  completedLessons: CompletedLessonEntity[];

  toDto() {
    return new EnrolledCourseDto({
      course: this.course.toDto(),
      completedLessons: this.completedLessons.map((l) => l.lessonId),
    });
  }
}
