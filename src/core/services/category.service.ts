import {
  CategoryCreateDto,
  CategoryDto,
  CategoryQueryDto,
  CategoryUpdateDto,
  PageDto,
} from '../models';

export interface CategorySerive {
  create(values: CategoryCreateDto): Promise<number>;

  update(values: CategoryUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<CategoryDto | undefined>;

  findBySlug(slug: string): Promise<CategoryDto | undefined>;

  find(query: CategoryQueryDto): Promise<PageDto<CategoryDto>>;
}

export const CATEGORY_SERVICE = 'CategoryService';
