import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CourseAuthorEntity } from './course-author.entity';
import { CategoryEntity } from './category.entity';
import { CourseSkillEntity } from './course-skill.entity';
import { CourseChapterEntity } from './course-chapter.entity';
import { CourseDto } from '../models/course.dto';

@Entity({ name: 'course' })
export class CourseEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2000 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  level: string;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Column({ name: 'published_by', nullable: true })
  publishedBy?: string;

  @OneToMany(() => CourseAuthorEntity, (type) => type.course)
  authors: CourseAuthorEntity[];

  @OneToMany(() => CourseSkillEntity, (type) => type.course)
  skills: CourseSkillEntity[];

  @OneToMany(() => CourseChapterEntity, (type) => type.course)
  chapters: CourseChapterEntity[];

  @OneToOne(() => CategoryEntity, (type) => type.course)
  category: CategoryEntity;

  toDto() {
    return new CourseDto({
      id: this.id,
      name: this.name,
      description: this.description,
      level: this.level,
      publishedAt: this.publishedAt?.getTime(),
      authors: this.authors.map((e) => e.author.toDto()),
      skills: this.skills.map((e) => e.skill.toDto()),
      chapters: this.chapters.map((e) => e.chapter.toDto()),
      category: this.category.toDto(),
      audit: this.toAudit(),
    });
  }
}
