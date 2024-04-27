import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'post_author' })
export class PostAuthorEntity {
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: string;

  @PrimaryColumn({ name: 'author_id' })
  authorId: string;

  @Column({ name: 'sort_order' })
  sortOrder: number;

  @ManyToOne(() => PostEntity, (type) => type.authors)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
