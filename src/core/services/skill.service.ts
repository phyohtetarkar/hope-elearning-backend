import { PageDto } from '../models';
import { SkillCreateDto } from '../models/skill-create.dto';
import { SkillQueryDto } from '../models/skill-query.dto';
import { SkillUpdateDto } from '../models/skill-update.dto';
import { SkillDto } from '../models/skill.dto';

export interface SkillService {
  create(values: SkillCreateDto): Promise<number>;

  update(values: SkillUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<SkillDto | null>;

  find(query: SkillQueryDto): Promise<PageDto<SkillDto>>;
}

export const SKILL_SERVICE = 'SkillService';
