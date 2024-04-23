import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { CategoryEntity } from '@/core/entities/category.entity';
import {
  CategoryCreateDto,
  CategoryDto,
  CategoryQueryDto,
  CategoryUpdateDto,
  PageDto,
  QueryDto,
} from '@/core/models';
import { CategorySerive } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Raw, Repository } from 'typeorm';

@Injectable()
export class TypeormCategoryService implements CategorySerive {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(values: CategoryCreateDto): Promise<number> {
    const result = await this.categoryRepo.insert({
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.categoryRepo.existsBy({ slug: v });
      }),
    });

    return result.identifiers[0].id;
  }

  async update(values: CategoryUpdateDto): Promise<number> {
    const exists = await this.categoryRepo.existsBy({ id: values.id });

    if (!exists) {
      throw new DomainError('Category not found');
    }

    await this.categoryRepo.update(values.id, {
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.categoryRepo.existsBy({ id: Not(values.id), slug: v });
      }),
    });

    return values.id;
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepo.delete({ id: id });
  }

  async findById(id: number): Promise<CategoryDto | null> {
    const entity = await this.categoryRepo.findOneBy({ id: id });
    return entity?.toDto() ?? null;
  }

  async findBySlug(slug: string): Promise<CategoryDto | null> {
    const entity = await this.categoryRepo.findOneBy({ slug: slug });
    return entity?.toDto() ?? null;
  }

  async find(query: CategoryQueryDto): Promise<PageDto<CategoryDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const [list, count] = await this.categoryRepo.findAndCount({
      where: {
        name: query.name
          ? Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
              name: `${query.name}%`,
            })
          : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return PageDto.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
