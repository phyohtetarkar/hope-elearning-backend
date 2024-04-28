import { Expose } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';

export class LessonDto {
  id: string;
  title: string;
  slug: string;
  trial: boolean;

  @Expose({ groups: ['detail'] })
  lexical?: string;

  chapter: ChapterDto;
  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
