import {
  PageDto,
  SkillCreateDto,
  SkillDto,
  SkillQueryDto,
  SkillUpdateDto,
} from '../models';

export interface SkillService {
  create(values: SkillCreateDto): Promise<number>;

  update(values: SkillUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<SkillDto | null>;

  find(query: SkillQueryDto): Promise<PageDto<SkillDto>>;
}

export const SKILL_SERVICE = 'SkillService';
