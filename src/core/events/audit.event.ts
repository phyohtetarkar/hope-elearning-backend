export class AuditEvent {
  resourceId: string;
  resourceType: string;
  context?: string;

  constructor(partial: Partial<AuditEvent> = {}) {
    Object.assign(this, partial);
  }
}
