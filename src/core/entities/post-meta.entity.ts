import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostMetaDto } from '../models';

@Entity({ name: 'post_meta' })
export class PostMetaEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'viewCount', type: 'bigint', default: 0 })
  viewCount: string;

  @OneToOne(() => PostEntity, (type) => type.meta)
  @JoinColumn({ name: 'id' })
  post?: PostEntity;

  toDto() {
    return new PostMetaDto({
      viewCount: this.viewCount,
    });
  }
}
