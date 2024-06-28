import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TagDto } from '../models';
import { AuditingEntity } from './auditing.entity';

@Entity({ name: 'tag' })
export class TagEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  toDto() {
    return new TagDto({
      id: this.id,
      slug: this.slug,
      name: this.name,
      audit: this.toAudit(),
    });
  }
}
