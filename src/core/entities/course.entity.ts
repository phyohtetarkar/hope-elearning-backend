import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseAccess, CourseDto, CourseLevel, CourseStatus } from '../models';
import { AuditingEntity } from './auditing.entity';
import { CategoryEntity } from './category.entity';
import { ChapterEntity } from './chapter.entity';
import { CourseAuthorEntity } from './course-author.entity';
import { CourseMetaEntity } from './course-meta.entity';

@Entity({ name: 'course' })
export class CourseEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  title: string;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  cover?: string | null;

  @Column({ default: false })
  featured: boolean;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({
    type: 'enum',
    enum: CourseAccess,
    default: CourseAccess.FREE,
  })
  access: CourseAccess;

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

  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string | null;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;

  @OneToOne(() => CourseMetaEntity, (type) => type.course)
  meta?: CourseMetaEntity;

  @OneToMany(() => CourseAuthorEntity, (type) => type.course)
  authors?: CourseAuthorEntity[];

  @OneToMany(() => ChapterEntity, (type) => type.course)
  chapters?: ChapterEntity[];

  toDto(compact?: boolean) {
    if (compact) {
      return new CourseDto({
        id: this.id,
        title: this.title,
        slug: this.slug,
        featured: this.featured,
        cover: this.cover ?? undefined,
        level: this.level,
        access: this.access,
        status: this.status,
        category: this.category?.toDto(),
        audit: this.toAudit(),
      });
    }
    return new CourseDto({
      id: this.id,
      title: this.title,
      slug: this.slug,
      cover: this.cover ?? undefined,
      excerpt: this.excerpt ?? undefined,
      description: this.description ?? undefined,
      featured: this.featured,
      level: this.level,
      access: this.access,
      status: this.status,
      publishedAt: this.publishedAt?.toISOString(),
      category: this.category?.toDto(),
      authors: this.authors
        ?.sort((a, b) => a.sortOrder - b.sortOrder)
        .map((e) => e.author.toDto()),
      chapters: this.chapters
        ?.sort((a, b) => {
          if (a.sortOrder === b.sortOrder) {
            return a.createdAt.getTime() - b.createdAt.getTime();
          }
          return a.sortOrder - b.sortOrder;
        })
        .map((e) => e.toDto()),
      meta: this.meta?.toDto(),
      audit: this.toAudit(),
    });
  }
}
