import { AuditingDto } from './auditing.dto';

export class CategoryDto {
  id: number;
  name: string;
  slug: string;
  audit?: AuditingDto;

  constructor(partial: Partial<CategoryDto> = {}) {
    Object.assign(this, partial);
  }
}
