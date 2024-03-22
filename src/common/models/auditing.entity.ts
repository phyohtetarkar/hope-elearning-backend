import { Column } from 'typeorm';
import { Audit } from './auditing.domain';

export abstract class AuditingEntity {
  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true, default: 'anonymous' })
  createdBy?: string;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true, default: 'anonymous' })
  updatedBy?: string;

  toAudit(): Audit {
    return new Audit({
      createdAt: this.createdAt.getTime(),
      createdBy: this.createdBy,
      updatedAt: this.updatedAt.getTime(),
      updatedBy: this.updatedBy,
    });
  }
}
