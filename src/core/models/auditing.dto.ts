export class AuditingDto {
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  // deletedAt?: string;
  // deletedBy?: string;

  constructor(partial: Partial<AuditingDto> = {}) {
    Object.assign(this, partial);
  }
}
