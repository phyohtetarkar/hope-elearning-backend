import { DomainError } from '@/common/errors/domain.error';
import { normalizeSlug } from '@/common/utils';
import { PostTagEntity } from '@/core/entities/post-tag.entity';
import { TagEntity } from '@/core/entities/tag.entity';
import { AuditEvent } from '@/core/events';
import {
  PageDto,
  PostStatus,
  QueryDto,
  TagCreateDto,
  TagDto,
  TagQueryDto,
  TagUpdateDto,
} from '@/core/models';
import { TagService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class TypeormTagService implements TagService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
    @InjectRepository(PostTagEntity)
    private postTagRepo: Repository<PostTagEntity>,
  ) {}

  async create(values: TagCreateDto): Promise<number> {
    const result = await this.tagRepo.insert({
      name: values.name,
      slug: await normalizeSlug({
        value: values.slug,
        exists: (v) => {
          return this.tagRepo.existsBy({ slug: v });
        },
      }),
    });

    this.eventEmitter.emit(
      'audit.created',
      new AuditEvent({
        resourceId: result.identifiers[0].id,
        resourceType: 'tag',
        context: JSON.stringify({ title: values.name }),
      }),
    );

    return result.identifiers[0].id;
  }

  async update(values: TagUpdateDto): Promise<number> {
    const id = values.id;
    const exists = await this.tagRepo.existsBy({ id: id });

    if (!exists) {
      throw new DomainError('Tag not found');
    }

    await this.tagRepo.update(values.id, {
      name: values.name,
      slug: await normalizeSlug({
        value: values.slug,
        exists: (v) => {
          return this.tagRepo.existsBy({ id: Not(id), slug: v });
        },
      }),
    });

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: values.id.toString(),
        resourceType: 'tag',
        context: JSON.stringify({ title: values.name }),
      }),
    );

    return values.id;
  }

  async delete(id: number): Promise<void> {
    const entity = await this.tagRepo.findOneBy({ id: id });

    if (!entity) {
      throw new DomainError('Tag not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.delete(PostTagEntity, { tagId: id });
      await em.delete(TagEntity, { id });
    });

    this.eventEmitter.emit(
      'audit.deleted',
      new AuditEvent({
        resourceId: id.toString(),
        resourceType: 'tag',
        context: JSON.stringify({ title: entity.name }),
      }),
    );
  }

  async findById(id: number): Promise<TagDto | undefined> {
    const entity = await this.tagRepo.findOneBy({ id: id });
    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<TagDto | undefined> {
    const entity = await this.tagRepo.findOneBy({ slug: slug });
    const dto = entity?.toDto();
    if (dto) {
      const count = await this.postTagRepo
        .createQueryBuilder('post_tag')
        .leftJoin('post_tag.post', 'post')
        .where('post_tag.tagId = :tagId', { tagId: dto.id })
        .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
        .getCount();
      dto.postCount = `${count}`;
    }
    return dto;
  }

  async find(query: TagQueryDto): Promise<PageDto<TagDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const tagQuery = this.tagRepo.createQueryBuilder('tag');

    const count = await tagQuery.getCount();

    if (query.includePostCount) {
      tagQuery
        .addSelect('COUNT(post_tag.tagId) AS tag_post_count')
        .leftJoin(PostTagEntity, 'post_tag', 'tag.id = post_tag.tagId')
        .groupBy('tag.id')
        .addGroupBy('tag.name')
        .addGroupBy('tag.slug');
    }

    if (query.name) {
      tagQuery.where('LOWER(tag.name) LIKE LOWER(:name)', {
        name: `%${query.name}`,
      });
    }

    tagQuery.orderBy('tag.createdAt', 'DESC').offset(offset).limit(limit);

    const { entities, raw } = await tagQuery.getRawAndEntities();

    return PageDto.from({
      list: entities.map((e, i) => {
        const dto = e.toDto();
        if (query.includePostCount) {
          dto.postCount = raw[i]['tag_post_count'];
        }
        return dto;
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
