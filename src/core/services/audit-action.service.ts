import { AuditEvent } from '../events';
import { AuditActionDto, AuditActionQueryDto, PageDto } from '../models';

export interface AuditActionService {
  create(values: AuditEvent): Promise<void>;

  update(values: AuditEvent): Promise<void>;

  delete(values: AuditEvent): Promise<void>;

  find(query: AuditActionQueryDto): Promise<PageDto<AuditActionDto>>;
}

export const AUDIT_ACTION_SERVICE = 'AuditActionService';
