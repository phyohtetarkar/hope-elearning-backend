import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { PostAuthorEntity } from './post-author.entity';
import { PostMetaEntity } from './post-meta.entity';
import { PostTagEntity } from './post-tag.entity';
import { PostVisibility, PostDto, PostStatus } from '../models';

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  cover?: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  title?: string | null;

  @Column({ length: 2000, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  @Column({ default: false })
  featured: boolean;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy?: string | null;

  @OneToMany(() => PostAuthorEntity, (type) => type.post)
  authors: PostAuthorEntity[];

  @OneToMany(() => PostTagEntity, (type) => type.post)
  tags?: PostTagEntity[];

  @OneToOne(() => PostMetaEntity, (type) => type.post)
  meta?: PostMetaEntity;

  toDto() {
    return new PostDto({
      id: this.id,
      cover: this.cover ?? undefined,
      title: this.title ?? undefined,
      slug: this.slug,
      excerpt: this.excerpt ?? undefined,
      lexical: this.lexical ?? undefined,
      status: this.status,
      visibility: this.visibility,
      featured: this.featured,
      publishedAt: this.publishedAt?.toISOString(),
      authors: this.authors
        ?.sort((a, b) => a.sortOrder - b.sortOrder)
        .map((e) => e.author.toDto()),
      tags: this.tags
        ?.sort((a, b) => a.sortOrder - b.sortOrder)
        .map((e) => e.tag.toDto()),
      meta: this.meta?.toDto(),
      audit: this.toAudit(),
    });
  }
}
