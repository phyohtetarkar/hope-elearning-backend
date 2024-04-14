import { AuditingDto } from './auditing.dto';
import { CourseDto } from './course.dto';
import { LessonDto } from './lesson.dto';

export class ChapterDto {
  id: number;
  title: string;
  slug: string;
  course: CourseDto;
  lessons?: LessonDto[];
  audit?: AuditingDto;

  constructor(partial: Partial<ChapterDto> = {}) {
    Object.assign(this, partial);
  }
}
