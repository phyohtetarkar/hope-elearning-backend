import { AuditingDto } from './auditing.dto';
import { LessonDto } from './lesson.dto';

export class ChapterDto {
  id: number;
  name: string;
  lessons: LessonDto[];
  audit?: AuditingDto;

  constructor(partial: Partial<ChapterDto> = {}) {
    Object.assign(this, partial);
  }
}
