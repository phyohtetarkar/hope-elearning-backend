import { TagEntity } from '@/blog/tag/models/tag.entity';
import { AuditingEntity } from '@/common/models/auditing.entity';
import { UserEntity } from '@/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus } from './post-status.enum';
import { PostViewEntity } from './post-view.entity';

@Entity({ name: 'post' })
export class PostEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'text', nullable: true })
  cover?: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt?: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'post_tag',
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Promise<TagEntity[]>;

  @OneToOne(() => PostViewEntity)
  @JoinColumn({ name: 'id' })
  postView?: PostViewEntity;
}
