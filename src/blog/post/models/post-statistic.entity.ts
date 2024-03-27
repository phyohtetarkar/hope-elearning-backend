import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostStatisticDto } from './post-statistic.dto';

@Entity({ name: 'post_statistic' })
export class PostStatisticEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'total_view', type: 'bigint', default: 0 })
  totalView: number;

  @OneToOne(() => PostEntity, (type) => type.statistic)
  @JoinColumn({ name: 'id' })
  post: PostEntity;

  toDto() {
    return new PostStatisticDto({
      totalView: this.totalView,
    });
  }
}
