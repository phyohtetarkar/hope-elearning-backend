import { PageDto } from '../models';
import { CategoryCreateDto } from '../models/category-create.dto';
import { CategoryQueryDto } from '../models/category-query.dto';
import { CategoryUpdateDto } from '../models/category-update.dto';
import { CategoryDto } from '../models/category.dto';

export interface CategorySerive {
  create(values: CategoryCreateDto): Promise<number>;

  update(values: CategoryUpdateDto): Promise<number>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<CategoryDto | null>;

  find(query: CategoryQueryDto): Promise<PageDto<CategoryDto>>;
}

export const CATEGORY_SERVICE = 'CategoryService';
