import { DomainError, Page, normalizeSlug } from '@/common';
import { UserRole } from '@/user/models/user-role.enum';
import { PostHistoryEntity } from '@/common/entities/post-history.entity';
import { PostStatisticEntity } from '@/common/entities/post-statistic.entity';
import { PostTagEntity } from '@/common/entities/post-tag.entity';
import { PostEntity } from '@/common/entities/post.entity';
import { TagEntity } from '@/common/entities/tag.entity';
import { UserEntity } from '@/common/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
import { PostStatus } from '../../models/post-status.enum';
import { PostUpdateInput } from '../../models/post-update.input';
import { PostDto } from '../../models/post.dto';
import { PostQuery } from '../../models/post.query';
import { PostService } from '../post.service';
import { SecurityContextProvider } from '@/common/providers/security-context.provider';

@Injectable()
export class TypeormPostService implements PostService {
  constructor(
    private security: SecurityContextProvider,
    private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(PostStatisticEntity)
    private postStatisticRepo: Repository<PostStatisticEntity>,
  ) {}

  async create(values: PostUpdateInput): Promise<number> {
    return await this.dataSource.transaction(async (em) => {
      const author = await em.findOneBy(UserEntity, { id: values.authorId });

      if (!author) {
        throw new DomainError('Author not found');
      }

      const authUser = this.security.getAuthenticatedUser();

      if (
        authUser.role !== UserRole.OWNER &&
        authUser.role !== UserRole.ADMIN
      ) {
        if (author.id !== authUser.id) {
          throw new DomainError('forbidden');
        }
      }

      const result = await em.insert(PostEntity, {
        cover: values.cover ?? null,
        title: values.title,
        excerpt: values.excerpt ?? null,
        body: values.body ?? null,
        author: author,
        slug: await normalizeSlug(values.slug, (v) => {
          return em.existsBy(PostEntity, { slug: v });
        }),
      });

      const postId = result.identifiers[0].id;

      if (values.tags && values.tags.length > 0) {
        const tagEntities = await em.findBy(TagEntity, { id: In(values.tags) });

        await em.insert(
          PostTagEntity,
          tagEntities.map((t) => {
            return {
              postId: postId,
              tagId: t.id,
            };
          }),
        );
      }

      if (!values.id) {
        const postStatisticEntity = new PostStatisticEntity();
        postStatisticEntity.totalView = 0;
        postStatisticEntity.id = postId;

        await em.save(postStatisticEntity);
      }

      return postId;
    });
  }

  async update(values: PostUpdateInput): Promise<number> {
    return await this.dataSource.transaction(async (em) => {
      const author = await em.findOneBy(UserEntity, { id: values.authorId });

      if (!author) {
        throw new DomainError('Author not found');
      }

      const authUser = this.security.getAuthenticatedUser();

      if (!authUser.isAdminOrOwner()) {
        if (author.id !== authUser.id) {
          throw new DomainError('forbidden');
        }
      }

      const postId = values.id ?? 0;

      const exists = await em.existsBy(PostEntity, {
        id: postId,
        author: !authUser.isAdminOrOwner()
          ? { id: values.authorId }
          : undefined,
      });

      if (!exists) {
        throw new DomainError('Post not found');
      }

      await em.update(PostEntity, postId, {
        cover: values.cover ?? null,
        title: values.title,
        excerpt: values.excerpt ?? null,
        body: values.body ?? null,
        author: author,
        slug: await normalizeSlug(values.slug, (v) => {
          return em.existsBy(PostEntity, { id: Not(postId), slug: v });
        }),
      });

      await em.delete(PostTagEntity, { postId: postId });

      if (values.tags && values.tags.length > 0) {
        const tagEntities = await em.findBy(TagEntity, { id: In(values.tags) });

        await em.insert(
          PostTagEntity,
          tagEntities.map((t) => {
            return {
              postId: postId,
              tagId: t.id,
            };
          }),
        );
      }

      return postId;
    });
  }

  async updateStatus(id: number, status: PostStatus): Promise<void> {
    const exists = await this.postRepo.existsBy({ id: id });
    if (!exists) {
      throw new DomainError('Post not found');
    }

    await this.postRepo.update({ id: id }, { status: status });
  }

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.delete(PostTagEntity, { postId: id });
      await em.delete(PostHistoryEntity, { postId: id });
      await em.delete(PostStatisticEntity, id);
      await em.delete(PostEntity, id);
    });
  }

  async findById(id: number): Promise<PostDto | null> {
    const entity = await this.postRepo.findOneBy({ id: id });
    return entity?.toDto() ?? null;
  }

  async findBySlug(slug: string): Promise<PostDto | null> {
    const entity = await this.postRepo.findOneBy({ slug: slug });
    if (entity) {
      this.postStatisticRepo.increment({ id: entity.id }, 'totalView', 1);
    }
    return entity?.toDto() ?? null;
  }

  async find(query: PostQuery): Promise<Page<PostDto>> {
    const { limit, offset } = query.getPageable();

    const [list, count] = await this.postRepo.findAndCount({
      relations: {
        tags: !!query.tagId,
      },
      where: {
        author: query.authorId ? { id: query.authorId } : undefined,
        status: query.status,
        access: query.access,
        featured: query.featured,
        title: query.q
          ? Raw((alias) => `LOWER(${alias}) LIKE LOWER(:title)`, {
              title: `%${query.q}%`,
            })
          : undefined,
        tags: query.tagId ? { tag: { id: query.tagId } } : undefined,
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
