import { Expose, Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';

export enum LessonType {
  TEXT = 'text',
  VIDEO = 'video',
  QUIZ = 'quiz',
}

export class LessonDto {
  @Transform(({ value }) => Number(value))
  id: number;
  title: string;
  slug: string;
  trial: boolean;
  type: LessonType;

  @Expose({ groups: ['lesson-detail'] })
  lexical?: string;

  wordCount: number;

  sortOrder: number;

  @Expose({ groups: ['lesson-detail'] })
  chapter?: ChapterDto;

  // @Expose({ groups: ['lesson-detail'] })
  // course?: CourseDto;

  @Expose({ groups: ['lesson-detail'] })
  completed?: boolean;

  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
