import { DomainError, Page, normalizeSlug } from '@/common';
import { PostTagEntity } from '@/common/entities/post-tag.entity';
import { TagEntity } from '@/common/entities/tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Raw, Repository } from 'typeorm';
import { TagDto } from '../../models/tag.dto';
import { TagInput } from '../../models/tag.input';
import { TagQuery } from '../../models/tag.query';
import { TagService } from '../tag.service';

@Injectable()
export class TypeormTagService implements TagService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async create(values: TagInput): Promise<number> {
    const result = await this.tagRepo.insert({
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.tagRepo.existsBy({ slug: v });
      }),
    });

    return result.identifiers[0].id;
  }

  async update(values: TagInput): Promise<number> {
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

  async find(query: TagQuery): Promise<Page<TagDto>> {
    const { limit, offset } = query.getPageable();

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

    return Page.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
