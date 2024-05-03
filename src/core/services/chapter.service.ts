import {
  ChapterCreateDto,
  ChapterDto,
  ChapterUpdateDto,
  SortUpdateDto,
} from '../models';

export interface ChapterService {
  create(values: ChapterCreateDto): Promise<string>;

  update(values: ChapterUpdateDto): Promise<void>;

  updateSort(values: [SortUpdateDto]): Promise<void>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<ChapterDto | undefined>;
}

export const CHAPTER_SERVICE = 'ChapterService';
