import { Column } from 'typeorm';
import { AuditingDto } from '../models/auditing.dto';

export abstract class AuditingEntity {
  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;

  // @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  // deletedAt?: Date;

  // @Column({ name: 'deleted_by', nullable: true })
  // deletedBy?: string;

  toAudit() {
    return new AuditingDto({
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
      updatedAt: this.updatedAt.toISOString(),
      updatedBy: this.updatedBy,
    });
  }
}
