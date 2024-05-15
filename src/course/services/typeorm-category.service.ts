import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { CategoryEntity } from '@/core/entities/category.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import {
  CategoryCreateDto,
  CategoryDto,
  CategoryQueryDto,
  CategoryUpdateDto,
  CourseStatus,
  PageDto,
  QueryDto,
} from '@/core/models';
import { CategorySerive } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class TypeormCategoryService implements CategorySerive {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
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

  async findById(id: number): Promise<CategoryDto | undefined> {
    const entity = await this.categoryRepo.findOneBy({ id: id });
    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<CategoryDto | undefined> {
    const entity = await this.categoryRepo.findOneBy({ slug: slug });
    const dto = entity?.toDto();

    if (dto) {
      const count = await this.courseRepo
        .createQueryBuilder('course')
        .where('course.category_id = :categoryId', { categoryId: dto.id })
        .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
        .getCount();
      dto.courseCount = `${count}`;
    }

    return dto;
  }

  async find(query: CategoryQueryDto): Promise<PageDto<CategoryDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const categoryQuery = this.categoryRepo.createQueryBuilder('category');

    const count = await categoryQuery.getCount();

    if (query.includeCourseCount) {
      categoryQuery.addSelect(
        'COUNT(course.category_id) AS category_course_count',
      );

      if (query.published) {
        categoryQuery.leftJoin(
          CourseEntity,
          'course',
          'category.id = course.category_id AND course.status = :status',
          {
            status: CourseStatus.PUBLISHED,
          },
        );
      } else {
        categoryQuery.leftJoin(
          CourseEntity,
          'course',
          'category.id = course.category_id',
        );
      }

      categoryQuery
        .groupBy('category.id')
        .addGroupBy('category.name')
        .addGroupBy('category.slug');
    }

    if (query.name) {
      categoryQuery.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${query.name}`,
      });
    }

    categoryQuery
      .orderBy('category.createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    const { entities, raw } = await categoryQuery.getRawAndEntities();

    return PageDto.from({
      list: entities.map((e, i) => {
        const dto = e.toDto();
        if (query.includeCourseCount) {
          dto.courseCount = raw[i]['category_course_count'];
        }
        return dto;
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
