import { AuditingEntity } from '@/common/models/auditing.entity';
import { UserEntity } from '@/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus } from './post-status.enum';
import { PostTagEntity } from './post-tag.entity';
import { PostStatisticEntity } from './post-statistic.entity';
import { PostDto } from './post.dto';
import { PostAccess } from './post-access.enum';

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: true })
  cover?: string | null;

  @Column({ type: 'text', nullable: true })
  title?: string | null;

  @Column({ type: 'text', unique: true })
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
      featured: this.featured,
      publishedAt: this.publishedAt?.getTime(),
      author: this.author.toDto(),
      tags: this.tags?.map((e) => e.tag.toDto()) ?? [],
      audit: this.toAudit(),
    });
  }
}
