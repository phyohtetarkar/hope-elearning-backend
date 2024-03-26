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

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: true })
  cover?: string;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({ default: false })
  featured: boolean;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @OneToMany(() => PostTagEntity, (type) => type.post, {
    cascade: true,
  })
  tags?: PostTagEntity[];

  @OneToOne(() => PostStatisticEntity, (type) => type.post)
  statistic?: PostStatisticEntity;

  toDto() {
    return new PostDto({
      id: this.id,
      cover: this.cover,
      title: this.title,
      slug: this.slug,
      excerpt: this.excerpt,
      body: this.body,
      status: this.status,
      featured: this.featured,
      //publishedAt: this.publishedAt,
      author: this.author.toDto(),
      tags: this.tags?.map((e) => e.tag.toDto()),
      audit: this.toAudit(),
    });
  }
}
