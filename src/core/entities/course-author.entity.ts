import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';

@Entity({ name: 'course_author' })
export class CourseAuthorEntity {
  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'author_id' })
  authorId: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.authors)
  @JoinColumn({ name: 'course_id' })
  course?: CourseEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
