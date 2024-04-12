import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { LessonDto } from '../models/lesson.dto';

@Entity({ name: 'lesson' })
export class LessonEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2000 })
  name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ default: false })
  completeStatus: boolean;

  toDto() {
    return new LessonDto({
      id: this.id,
      name: this.name,
      content: this.content,
      duration: this.duration,
      completeStatus: this.completeStatus,
      audit: this.toAudit(),
    });
  }
}
