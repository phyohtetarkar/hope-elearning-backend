import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { SkillDto } from '../models/skill.dto';

@Entity({ name: 'skill' })
export class SkillEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 2000 })
  name: string;

  @Column({ length: 2000, unique: true })
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
