import { Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';

export class TagDto {
  @Transform(({ value }) => Number(value))
  id: number;
  slug: string;
  name: string;
  postCount?: string;
  audit?: AuditingDto;

  constructor(partial: Partial<TagDto> = {}) {
    Object.assign(this, partial);
  }
}
