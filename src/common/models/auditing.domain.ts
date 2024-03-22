export class Audit {
  createdAt: number;
  createdBy?: string | null;
  updatedAt: number;
  updatedBy?: string | null;

  constructor(partial: Partial<Audit> = {}) {
    Object.assign(this, partial);
  }
}
