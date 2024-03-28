import {
  DomainError,
  PAGE_SIZE,
  Page,
  normalizeSlug,
  stringToSlug,
} from '@/common';
import { PostStatisticEntity } from '@/persistence/entities/post-statistic.entity';
import { PostTagEntity } from '@/persistence/entities/post-tag.entity';
import { PostEntity } from '@/persistence/entities/post.entity';
import { TagEntity } from '@/persistence/entities/tag.entity';
import { UserEntity } from '@/persistence/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
import { PostService } from '../post.service';
import { PostUpdateInput } from '../../models/post-update.input';
import { PostDto } from '../../models/post.dto';
import { PostStatus } from '../../models/post-status.enum';
import { PostQuery } from '../../models/post.query';

@Injectable()
export class TypeormPostService implements PostService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
  ) {}

  async save(values: PostUpdateInput): Promise<PostDto> {
    return await this.dataSource.transaction(async (em) => {
      const author = await em.findOneBy(UserEntity, { id: values.authorId });

      if (!author) {
        throw new DomainError('Author not found');
      }

      const entity = new PostEntity();
      entity.id = values.id ?? 0;
      entity.cover = values.cover;
      entity.title = values.title;
      entity.excerpt = values.excerpt;
      entity.body = values.body;
      entity.author = author;
      entity.slug = await normalizeSlug(stringToSlug(values.title), (v) => {
        return em.existsBy(PostEntity, { id: Not(entity.id), slug: v });
      });

      const result = await em.save(entity);
      await em.delete(PostTagEntity, { postId: result.id });

      const tagEntities = await em.findBy(TagEntity, { id: In(values.tags) });

      const postTags = await em.save(
        PostTagEntity,
        tagEntities.map((t) => {
          const pt = new PostTagEntity();
          pt.postId = result.id;
          pt.tagId = t.id;
          return pt;
        }),
      );

      if (!values.id) {
        const postStatisticEntity = new PostStatisticEntity();
        postStatisticEntity.totalView = 0;
        postStatisticEntity.id = result.id;

        await em.save(postStatisticEntity);
      }

      result.tags = postTags;

      return result.toDto();
    });
  }

  async updateStatus(id: number, status: PostStatus): Promise<void> {
    const exists = await this.postRepo.existsBy({ id: id });
    if (!exists) {
      throw 'Post not found';
    }

    await this.postRepo.update({ id: id }, { status: status });
  }

  async delete(id: number): Promise<void> {
    await this.postRepo.delete(id);
  }

  async findById(id: number): Promise<PostDto | null> {
    const entity = await this.postRepo.findOneBy({ id: id });
    return entity ? entity.toDto() : null;
  }

  async findBySlug(slug: string): Promise<PostDto | null> {
    const entity = await this.postRepo.findOneBy({ slug: slug });
    return entity ? entity.toDto() : null;
  }

  async find(query: PostQuery): Promise<Page<PostDto>> {
    const page = query.page ?? 0;
    const offest = page * PAGE_SIZE;
    const limit = PAGE_SIZE;

    const [list, count] = await this.postRepo.findAndCount({
      where: {
        author: query.authorId ? { id: query.authorId } : undefined,
        status: query.status,
        featured: query.featured,
        title: query.q
          ? Raw((alias) => `LOWER(${alias}) LIKE LOWER(:title)`, {
              title: `${query.q}%`,
            })
          : undefined,
        tags: query.q
          ? Raw(
              (alias) => `SELECT *
          FROM el_post p
          INNER JOIN el_post_tag pt ON p.id = pt.post_id
          INNER JOIN el_tag t ON pt.tag_id = t.id
          WHERE LOWER(${alias}) LIKE LOWER(:name)`,
              {
                name: `${query.q}%`,
              },
            )
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
