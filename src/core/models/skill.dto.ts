import { AuditingDto } from './auditing.dto';

export class SkillDto {
  id: number;
  name: string;
  audit?: AuditingDto;

  constructor(partial: Partial<SkillDto> = {}) {
    Object.assign(this, partial);
  }
}
