import { Page } from '@/common';
import { TagDto } from '../models/tag.dto';
import { TagInput } from '../models/tag.input';
import { TagQuery } from '../models/tag.query';

export interface TagService {
  create(values: TagInput): Promise<number>;

  update(values: TagInput): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<TagDto | null>;

  findBySlug(slug: string): Promise<TagDto | null>;

  find(query: TagQuery): Promise<Page<TagDto>>;
}

export const TAG_SERVICE = 'TagService';
