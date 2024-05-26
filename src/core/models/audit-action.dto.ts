export class AuditActionDto {
  resourceId: string;
  resourceType: string;
  actorId: string;
  actorType: string;
  actorName: string;
  actorImage?: string | null;
  event: string;
  context?: string;
  createdAt: string;
  count: number;

  constructor(partial: Partial<AuditActionDto> = {}) {
    Object.assign(this, partial);
  }
}
