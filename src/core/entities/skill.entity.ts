import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { SkillDto } from '../models';

@Entity({ name: 'skill' })
export class SkillEntity extends AuditingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  toDto() {
    return new SkillDto({
      id: this.id,
      name: this.name,
      slug: this.slug,
      audit: this.toAudit(),
    });
  }
}
