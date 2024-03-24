import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'post_view' })
export class PostViewEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  total: number;
}
