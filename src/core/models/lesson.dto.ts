import { Exclude, Expose } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';
import { CourseDto } from './course.dto';

export enum LessonStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export class LessonDto {
  id: string;
  title: string;
  slug: string;
  trial: boolean;

  @Exclude()
  status: LessonStatus;

  @Expose({ groups: ['lesson-detail'] })
  lexical?: string;

  sortOrder: number;

  @Exclude()
  chapterId: string;

  @Expose({ groups: ['lesson-detail'] })
  chapter?: ChapterDto;

  @Expose({ groups: ['lesson-detail'] })
  course?: CourseDto;

  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
