import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';

@Entity({ name: 'post_tag' })
export class PostTagEntity {
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: number;

  @PrimaryColumn({ name: 'tag_id', type: 'bigint' })
  tagId: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ManyToOne(() => PostEntity, (type) => type.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => TagEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;
}
