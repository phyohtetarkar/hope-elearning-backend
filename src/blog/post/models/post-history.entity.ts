import { UserEntity } from '@/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'post_history' })
export class PostHistoryEntity {
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: number;

  @PrimaryColumn({ name: 'author_id' })
  authorId: string;

  @PrimaryColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
