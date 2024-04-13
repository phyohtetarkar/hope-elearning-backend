import { QueryDto } from './query.dto';

export class LessonQueryDto extends QueryDto {
  name?: string;

  constructor(partial: Partial<LessonQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
