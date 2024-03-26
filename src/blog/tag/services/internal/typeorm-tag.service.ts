import { PAGE_SIZE } from '@/common/constants';
import { Page } from '@/common/models/page.domain';
import { normalizeSlug, stringToSlug } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';
import { TagDto } from '../../models/tag.dto';
import { TagEntity } from '../../models/tag.entity';
import { TagInput } from '../../models/tag.input';
import { TagQuery } from '../../models/tag.query';
import { TagService } from '../tag.service';
import { PostTagEntity } from '@/blog/post/models/post-tag.entity';

@Injectable()
export class TypeormTagService implements TagService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
    @InjectRepository(PostTagEntity)
    private postTagRepo: Repository<PostTagEntity>,
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
      this.postTagRepo.delete(id);
      //this.tagRepo.delete(id);
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
