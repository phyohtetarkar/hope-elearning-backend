import { AuditingDto } from './auditing.dto';
import { CourseDto } from './course.dto';
import { LessonDto } from './lesson.dto';

export class ChapterDto {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  course?: CourseDto;
  lessons?: LessonDto[];
  audit?: AuditingDto;

  constructor(partial: Partial<ChapterDto> = {}) {
    Object.assign(this, partial);
  }
}
