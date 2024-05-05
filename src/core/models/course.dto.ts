import { Expose } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { CategoryDto } from './category.dto';
import { ChapterDto } from './chapter.dto';
import { UserDto } from './user.dto';
import { CourseMetaDto } from './course-meta.dto';

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
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
  cover?: string;
  excerpt?: string;
  featured: boolean;

  @Expose({ groups: ['detail'] })
  description?: string;

  level: CourseLevel;
  access: CourseAccess;
  status: CourseStatus;
  publishedAt?: string;
  category?: CategoryDto;
  authors: UserDto[];

  @Expose({ groups: ['detail'] })
  chapters?: ChapterDto[];

  meta?: CourseMetaDto;
  audit?: AuditingDto;

  constructor(partial: Partial<CourseDto> = {}) {
    Object.assign(this, partial);
  }
}
