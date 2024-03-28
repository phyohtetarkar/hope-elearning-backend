import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';

@Entity({ name: 'post_tag' })
export class PostTagEntity {
  @PrimaryColumn({ name: 'post_id', type: 'bigint' })
  postId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => PostEntity, (type) => type.tags)
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;
}
