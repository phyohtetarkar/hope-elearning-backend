import { AuditingDto } from './auditing.dto';
import { CourseDto } from './course.dto';

export class CategoryDto {
  id: number;
  name: string;
  course: CourseDto;
  audit?: AuditingDto;

  constructor(partial: Partial<CategoryDto> = {}) {
    Object.assign(this, partial);
  }
}
