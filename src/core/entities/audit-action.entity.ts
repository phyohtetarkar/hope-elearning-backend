import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit_action' })
@Index('IDX_AUDIT_ACTION', [
  'resourceId',
  'resourceType',
  'actorId',
  'actorType',
  'event',
  'createdAt',
])
export class AuditActionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'resource_id', length: 50 })
  resourceId: string;

  @Column({ name: 'resource_type', length: 50 })
  resourceType: string;

  @Column({ name: 'actor_id', length: 50 })
  actorId: string;

  @Column({ name: 'actor_type', length: 50 })
  actorType: string;

  @Column({ length: 50 })
  event: string;

  @Column({ type: 'text', nullable: true })
  context?: string | null;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
