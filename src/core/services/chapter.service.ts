import {
  ChapterCreateDto,
  ChapterDto,
  ChapterUpdateDto,
  SortUpdateDto,
} from '../models';

export interface ChapterService {
  create(values: ChapterCreateDto): Promise<number>;

  update(values: ChapterUpdateDto): Promise<void>;

  updateSort(values: SortUpdateDto[]): Promise<void>;

  delete(courseId: number, chapterId: number): Promise<void>;

  findById(id: number): Promise<ChapterDto | undefined>;
}

export const CHAPTER_SERVICE = 'ChapterService';
