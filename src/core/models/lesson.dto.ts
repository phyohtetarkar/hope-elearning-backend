import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';

export class LessonDto {
  id: number;
  title: string;
  slug: string;
  lexical: string;
  duration: number;
  completed: boolean;
  chapter: ChapterDto;
  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
