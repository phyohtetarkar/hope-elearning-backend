import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';

export class LessonDto {
  id: string;
  title: string;
  slug: string;
  trial: boolean;
  lexical?: string;
  chapter: ChapterDto;
  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
