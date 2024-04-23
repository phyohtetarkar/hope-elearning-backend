import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CategoryEntity } from './category.entity';
import { ChapterEntity } from './chapter.entity';
import { CourseAuthorEntity } from './course-author.entity';
import { CourseSkillEntity } from './course-skill.entity';
import { CourseDto } from '../models';

@Entity({ name: 'course' })
export class CourseEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

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

  @OneToMany(() => ChapterEntity, (type) => type.course)
  chapters?: ChapterEntity[];

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  toDto() {
    return new CourseDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      level: this.level,
      publishedAt: this.publishedAt?.getTime(),
      authors: this.authors.map((e) => e.author.toDto()),
      skills: this.skills.map((e) => e.skill.toDto()),
      chapters: this.chapters?.map((e) => e.toDto()),
      category: this.category.toDto(),
      audit: this.toAudit(),
    });
  }
}
