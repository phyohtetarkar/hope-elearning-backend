import { Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';

export class CategoryDto {
  @Transform(({ value }) => Number(value))
  id: number;
  name: string;
  slug: string;
  courseCount?: string;
  audit?: AuditingDto;

  constructor(partial: Partial<CategoryDto> = {}) {
    Object.assign(this, partial);
  }
}
