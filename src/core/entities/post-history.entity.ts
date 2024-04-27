import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { PostStatus } from '../models/post.dto';

@Entity({ name: 'post_history' })
export class PostHistoryEntity {
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: string;

  @PrimaryColumn({ name: 'author_id' })
  authorId: string;

  @PrimaryColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 2000 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  lexical?: string | null;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  cover?: string | null;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
