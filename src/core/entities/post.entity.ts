import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { PostAuthorEntity } from './post-author.entity';
import { PostStatisticEntity } from './post-statistic.entity';
import { PostTagEntity } from './post-tag.entity';
import { PostAccess, PostDto, PostStatus } from '../models';

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

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
    enum: PostAccess,
    default: PostAccess.PUBLIC,
  })
  access: PostAccess;

  @Column({ default: false })
  featured: boolean;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Column({ name: 'published_by', nullable: true })
  publishedBy?: string;

  @OneToMany(() => PostAuthorEntity, (type) => type.post)
  authors: PostAuthorEntity[];

  @OneToMany(() => PostTagEntity, (type) => type.post)
  tags?: PostTagEntity[];

  @OneToOne(() => PostStatisticEntity, (type) => type.post)
  statistic?: PostStatisticEntity;

  toDto() {
    return new PostDto({
      id: this.id,
      cover: this.cover ?? undefined,
      title: this.title ?? undefined,
      slug: this.slug,
      excerpt: this.excerpt ?? undefined,
      lexical: this.lexical ?? undefined,
      status: this.status,
      access: this.access,
      featured: this.featured,
      publishedAt: this.publishedAt?.getTime(),
      authors: this.authors
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((e) => e.author.toDto()),
      tags:
        this.tags
          ?.sort((a, b) => a.sortOrder - b.sortOrder)
          .map((e) => e.tag.toDto()) ?? [],
      audit: this.toAudit(),
    });
  }
}
