import { QueryDto } from './query.dto';

export class SkillQueryDto extends QueryDto {
  name?: string;

  constructor(partial: Partial<SkillQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
