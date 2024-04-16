import { JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';
import { AuditingEntity } from './auditing.entity';

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
}
