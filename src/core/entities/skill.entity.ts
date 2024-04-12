import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { SkillDto } from '../models/skill.dto';

@Entity({ name: 'skill' })
export class SkillEntity extends AuditingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  toDto() {
    return new SkillDto({
      id: this.id,
      name: this.name,
      audit: this.toAudit(),
    });
  }
}
