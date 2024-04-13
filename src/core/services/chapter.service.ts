import { PageDto } from '../models';
import { ChapterCreateDto } from '../models/chapter-create.dto';
import { ChapterQueryDto } from '../models/chapter-query.dto';
import { ChapterUpdateDto } from '../models/chapter-update.dto';
import { ChapterDto } from '../models/chapter.dto';

export interface ChapterService {
  create(values: ChapterCreateDto): Promise<number>;

  update(values: ChapterUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<ChapterDto | null>;

  find(query: ChapterQueryDto): Promise<PageDto<ChapterDto>>;
}

export const CHAPTER_SERVICE = 'ChapterService';