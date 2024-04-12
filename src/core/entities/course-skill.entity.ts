import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { SkillEntity } from './skill.entity';

@Entity({ name: 'course_skill' })
export class CourseSkillEntity {
  @PrimaryColumn({ name: 'course_id', type: 'bigint' })
  courseId: number;

  @PrimaryColumn({ name: 'skill_id' })
  skillId: number;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => CourseEntity, (type) => type.skills)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;

  @ManyToOne(() => SkillEntity)
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;
}
