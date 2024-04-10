import {
  PageDto,
  TagCreateDto,
  TagDto,
  TagQueryDto,
  TagUpdateDto,
} from '../models';

export interface TagService {
  create(values: TagCreateDto): Promise<number>;

  update(values: TagUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<TagDto | null>;

  findBySlug(slug: string): Promise<TagDto | null>;

  find(query: TagQueryDto): Promise<PageDto<TagDto>>;
}

export const TAG_SERVICE = 'TagService';
