import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CategoryDto } from '../models';

@Entity({ name: 'category' })
export class CategoryEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  name: string;

  @Column({ length: 2000, unique: true })
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
