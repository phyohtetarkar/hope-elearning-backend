import { QueryDto } from './query.dto';

export class CategoryQueryDto extends QueryDto {
  name?: string;

  includeCourseCount?: boolean;

  constructor(partial: Partial<CategoryQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
