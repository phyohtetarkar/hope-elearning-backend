import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTagEntity } from './post-tag.entity';
import { PostStatisticEntity } from './post-statistic.entity';
import { AuditingEntity } from './auditing.entity';
import { UserEntity } from './user.entity';
import { PostStatus } from '@/blog/models/post-status.enum';
import { PostAccess } from '@/blog/models/post-access.enum';
import { PostDto } from '@/blog/models/post.dto';

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  cover?: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  title?: string | null;

  @Column({ type: 'varchar', length: 2000, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string | null;

  @Column({ type: 'text', nullable: true })
  body?: string | null;

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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

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
      body: this.body ?? undefined,
      status: this.status,
      access: this.access,
      featured: this.featured,
      publishedAt: this.publishedAt?.getTime(),
      author: this.author.toDto(),
      tags: this.tags?.map((e) => e.tag.toDto()) ?? [],
      audit: this.toAudit(),
    });
  }
}
