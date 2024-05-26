import { QueryDto } from './query.dto';

export class AuditActionQueryDto extends QueryDto {
  event?: string;
  resource?: string;

  constructor(partial: Partial<AuditActionQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
