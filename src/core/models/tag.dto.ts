import { AuditingDto } from './auditing.dto';

export class TagDto {
  id: number;
  slug: string;
  name: string;
  audit?: AuditingDto;

  constructor(partial: Partial<TagDto> = {}) {
    Object.assign(this, partial);
  }
}
