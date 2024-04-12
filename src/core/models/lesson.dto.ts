import { AuditingDto } from './auditing.dto';

export class LessonDto {
  id: number;
  name: string;
  content: string;
  duration: number;
  completeStatus: boolean;
  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
