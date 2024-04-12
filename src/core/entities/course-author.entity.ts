import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';

@Entity({ name: 'course_author' })
export class CourseAuthorEntity {
  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'author_id', length: 128 })
  authorId: string;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.authors)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
