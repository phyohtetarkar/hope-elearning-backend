import { Injectable } from '@nestjs/common';
import { DataSource, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGE_SIZE, Page, normalizeSlug, stringToSlug } from '@/common';
import { TagEntity } from '@/persistence/entities/tag.entity';
import { PostTagEntity } from '@/persistence/entities/post-tag.entity';
import { TagService } from '../tag.service';
import { TagDto } from '../../models/tag.dto';
import { TagInput } from '../../models/tag.input';
import { TagQuery } from '../../models/tag.query';

@Injectable()
export class TypeormTagService implements TagService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async save(values: TagInput): Promise<TagDto> {
    const entity = new TagEntity();
    entity.id = values.id;
    entity.name = values.name;
    entity.slug = await normalizeSlug(stringToSlug(values.name), (v) => {
      return this.tagRepo.existsBy({ slug: v });
    });

    const result = await this.tagRepo.save(entity);

    return result.toDto();
  }

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      em.delete(PostTagEntity, { tagId: id });
      em.delete(TagEntity, { id });
    });
  }

  async findById(id: number): Promise<TagDto | null> {
    const entity = await this.tagRepo.findOneBy({ id: id });
    return entity ? entity.toDto() : null;
  }

  async find(query: TagQuery): Promise<Page<TagDto>> {
    const page = query.page ?? 0;
    const offest = page * PAGE_SIZE;
    const limit = PAGE_SIZE;

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
      skip: offest,
      take: limit,
    });

    return Page.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offest,
      limit: limit,
    });
  }
}
