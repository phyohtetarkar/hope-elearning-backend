import { Expose } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';
import { CourseDto } from './course.dto';

export class LessonDto {
  id: string;
  title: string;
  slug: string;
  trial: boolean;

  @Expose({ groups: ['detail'] })
  lexical?: string;

  sortOrder: number;

  chapter?: ChapterDto;
  course?: CourseDto;
  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
