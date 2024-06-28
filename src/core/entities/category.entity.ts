import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryDto } from '../models';
import { AuditingEntity } from './auditing.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  toDto() {
    return new CategoryDto({
      id: this.id,
      name: this.name,
      slug: this.slug,
      audit: this.toAudit(),
    });
  }
}
