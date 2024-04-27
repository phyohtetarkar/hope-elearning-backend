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
import { CourseDto, CourseLevel, CourseStatus } from '../models';

@Entity({ name: 'course' })
export class CourseEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Column({ name: 'published_by', nullable: true })
  publishedBy?: string;

  @ManyToOne(() => CategoryEntity)
  category: CategoryEntity;

  @OneToMany(() => CourseAuthorEntity, (type) => type.course)
  authors: CourseAuthorEntity[];

  @OneToMany(() => CourseSkillEntity, (type) => type.course)
  skills: CourseSkillEntity[];

  @OneToMany(() => ChapterEntity, (type) => type.course)
  chapters?: ChapterEntity[];

  toDto() {
    return new CourseDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      level: this.level,
      status: this.status,
      publishedAt: this.publishedAt?.toISOString(),
      authors: this.authors.map((e) => e.author.toDto()),
      skills: this.skills.map((e) => e.skill.toDto()),
      chapters: this.chapters?.map((e) => e.toDto()),
      category: this.category.toDto(),
      audit: this.toAudit(),
    });
  }
}
