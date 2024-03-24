export class Audit {
  createdAt: number;
  createdBy?: string;
  updatedAt: number;
  updatedBy?: string;
  deletedAt?: number;
  deletedBy?: string;

  constructor(partial: Partial<Audit> = {}) {
    Object.assign(this, partial);
  }
}
