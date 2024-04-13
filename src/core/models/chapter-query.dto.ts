import { QueryDto } from './query.dto';

export class ChapterQueryDto extends QueryDto {
  name?: string;

  constructor(partial: Partial<ChapterQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
