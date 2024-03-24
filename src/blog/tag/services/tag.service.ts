import { Page } from '@/common/models/page.domain';
import { TagDto } from '../models/tag.dto';
import { TagInput } from '../models/tag.input';
import { TagQuery } from '../models/tag.query';

export interface TagService {
  save(values: TagInput): Promise<TagDto>;

  findById(id: number): Promise<TagDto | null>;

  findAll(query: TagQuery): Promise<Page<TagDto>>;
}

export const TAG_SERVICE = 'TagService';
