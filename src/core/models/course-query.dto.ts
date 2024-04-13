import { QueryDto } from './query.dto';

export class CourseQueryDto extends QueryDto {
  name?: string;
  level?: string;
  authorId?: string;
  skillId?: number;
  categoryId?: string;

  constructor(partial: Partial<CourseQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}