import {
  ChapterCreateDto,
  ChapterDto,
  ChapterUpdateDto,
  PageDto,
  QueryDto,
} from '../models';

export interface ChapterService {
  create(values: ChapterCreateDto): Promise<number>;

  update(values: ChapterUpdateDto): Promise<number>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<ChapterDto | null>;

  find(query: QueryDto): Promise<PageDto<ChapterDto>>;
}

export const CHAPTER_SERVICE = 'ChapterService';
