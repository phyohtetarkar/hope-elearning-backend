import { Expose, Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { CourseDto } from './course.dto';
import { LessonDto } from './lesson.dto';

export class ChapterDto {
  @Transform(({ value }) => Number(value))
  id: number;
  title: string;
  slug: string;
  sortOrder: number;
  course?: CourseDto;

  @Expose({ groups: ['detail'] })
  lessons?: LessonDto[];

  audit?: AuditingDto;

  constructor(partial: Partial<ChapterDto> = {}) {
    Object.assign(this, partial);
  }
}
