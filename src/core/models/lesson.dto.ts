import { Exclude, Expose } from 'class-transformer';
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
  id: string;
  title: string;
  slug: string;
  trial: boolean;
  status: LessonStatus;
  type: LessonType;

  @Expose({ groups: ['lesson-detail'] })
  lexical?: string;

  sortOrder: number;

  courseId: string;

  @Exclude()
  chapterId: string;

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
