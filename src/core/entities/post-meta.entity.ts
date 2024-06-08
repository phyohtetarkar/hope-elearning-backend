import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PostMetaDto } from '../models';
import { PostEntity } from './post.entity';

@Entity({ name: 'post_meta' })
export class PostMetaEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'view_count', type: 'bigint', default: 0 })
  viewCount: string;

  @OneToOne(() => PostEntity, (type) => type.meta, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  post?: PostEntity;

  toDto() {
    return new PostMetaDto({
      viewCount: this.viewCount,
    });
  }
}
