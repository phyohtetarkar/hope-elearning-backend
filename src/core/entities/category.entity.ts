import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditingEntity } from './auditing.entity';
import { CourseEntity } from './course.entity';
import { CategoryDto } from '../models/category.dto';

@Entity({ name: 'category' })
export class CategoryEntity extends AuditingEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 2000 })
  name: string;

  @OneToOne(() => CourseEntity, (type) => type.category)
  @JoinColumn({ name: 'id' })
  course: CourseEntity;

  toDto() {
    return new CategoryDto({
      id: this.id,
      name: this.name,
      course: this.course.toDto(),
      audit: this.toAudit(),
    });
  }
}
