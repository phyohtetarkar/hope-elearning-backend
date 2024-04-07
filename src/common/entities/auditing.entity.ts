import { Audit } from '@/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AuditingEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true, default: 'anonymous' })
  createdBy?: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true, default: 'anonymous' })
  updatedBy?: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by', nullable: true })
  deletedBy?: string;

  toAudit(): Audit {
    return new Audit({
      createdAt: this.createdAt.getTime(),
      createdBy: this.createdBy,
      updatedAt: this.updatedAt.getTime(),
      updatedBy: this.updatedBy,
      deletedAt: this.deletedAt?.getTime(),
      deletedBy: this.deletedBy,
    });
  }
}
