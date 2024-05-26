import { Exclude, Expose, Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { ChapterDto } from './chapter.dto';
import { CourseDto } from './course.dto';

export enum LessonStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum LessonType {
  TEXT = 'text',
  VIDEO = 'video',
}

export class LessonDto {
  @Transform(({ value }) => Number(value))
  id: number;
  title: string;
  slug: string;
  trial: boolean;
  status: LessonStatus;
  type: LessonType;

  @Expose({ groups: ['lesson-detail'] })
  lexical?: string;

  wordCount: number;

  sortOrder: number;

  @Transform(({ value }) => Number(value))
  courseId: number;

  @Exclude()
  chapterId: number;

  @Expose({ groups: ['lesson-detail'] })
  chapter?: ChapterDto;

  @Expose({ groups: ['lesson-detail'] })
  course?: CourseDto;

  @Expose({ groups: ['lesson-detail'] })
  completed?: boolean;

  audit?: AuditingDto;

  constructor(partial: Partial<LessonDto> = {}) {
    Object.assign(this, partial);
  }
}
