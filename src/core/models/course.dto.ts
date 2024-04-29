import { Expose } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { CategoryDto } from './category.dto';
import { ChapterDto } from './chapter.dto';
import { UserDto } from './user.dto';

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  DISABLED = 'disabled',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseAccess {
  FREE = 'free',
  PREMIUM = 'premium',
}

export class CourseDto {
  id: string;
  title: string;
  slug: string;

  @Expose({ groups: ['detail'] })
  description?: string;

  level: CourseLevel;
  status: CourseStatus;
  publishedAt?: string;
  category: CategoryDto;
  authors: UserDto[];
  chapters?: ChapterDto[];
  audit?: AuditingDto;

  constructor(partial: Partial<CourseDto> = {}) {
    Object.assign(this, partial);
  }
}
