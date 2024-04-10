import { DomainError } from '@/common/errors/domain.error';
import { normalizeSlug } from '@/common/utils';
import { PostTagEntity } from '@/core/entities/post-tag.entity';
import { TagEntity } from '@/core/entities/tag.entity';
import {
  PageDto,
  QueryDto,
  TagCreateDto,
  TagDto,
  TagQueryDto,
  TagUpdateDto,
} from '@/core/models';
import { TagService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Raw, Repository } from 'typeorm';

@Injectable()
export class TypeormTagService implements TagService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async create(values: TagCreateDto): Promise<number> {
    const result = await this.tagRepo.insert({
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.tagRepo.existsBy({ slug: v });
      }),
    });

    return result.identifiers[0].id;
  }

  async update(values: TagUpdateDto): Promise<number> {
    const exists = await this.tagRepo.existsBy({ id: values.id });

    if (!exists) {
      throw new DomainError('Tag not found');
    }

    await this.tagRepo.update(values.id, {
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.tagRepo.existsBy({ id: Not(values.id), slug: v });
      }),
    });

    return values.id;
  }

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(PostTagEntity, { tagId: id });
      await em.delete(TagEntity, { id });
    });
  }

  async findById(id: number): Promise<TagDto | null> {
    const entity = await this.tagRepo.findOneBy({ id: id });
    return entity?.toDto() ?? null;
  }

  async findBySlug(slug: string): Promise<TagDto | null> {
    const entity = await this.tagRepo.findOneBy({ slug: slug });
    return entity?.toDto() ?? null;
  }

  async find(query: TagQueryDto): Promise<PageDto<TagDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const [list, count] = await this.tagRepo.findAndCount({
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
