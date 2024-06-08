import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseReviewDto } from '../models';
import { AuditingEntity } from './auditing.entity';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'course_review' })
export class CourseReviewEntity extends AuditingEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @Column({ type: 'smallint', default: 0 })
  rating: number;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  message?: string | null;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  toDto() {
    return new CourseReviewDto({
      rating: this.rating,
      message: this.message ?? undefined,
      user: this.user.toDto(),
      audit: this.toAudit(),
    });
  }
}
