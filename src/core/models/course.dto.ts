import { AuditingDto } from './auditing.dto';
import { CategoryDto } from './category.dto';
import { ChapterDto } from './chapter.dto';
import { SkillDto } from './skill.dto';
import { UserDto } from './user.dto';

export class CourseDto {
  id: number;
  name: string;
  description: string;
  level: string | null;
  publishedAt?: number;
  authors: UserDto[];
  skills: SkillDto[];
  chapters: ChapterDto[];
  category: CategoryDto;
  audit?: AuditingDto;

  constructor(partial: Partial<CourseDto> = {}) {
    Object.assign(this, partial);
  }
}
