import {
  ChapterCreateDto,
  ChapterDto,
  ChapterQueryDto,
  ChapterUpdateDto,
  PageDto,
} from '../models';

export interface ChapterService {
  create(values: ChapterCreateDto): Promise<number>;

  update(values: ChapterUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<ChapterDto | null>;

  find(query: ChapterQueryDto): Promise<PageDto<ChapterDto>>;
}

export const CHAPTER_SERVICE = 'ChapterService';
