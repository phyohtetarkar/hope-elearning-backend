import { DomainError } from '@/common/errors/domain.error';
import { normalizeSlug, transformToArray } from '@/common/utils';
import { PostAuthorEntity } from '@/core/entities/post-author.entity';
import { PostMetaEntity } from '@/core/entities/post-meta.entity';
import { PostTagEntity } from '@/core/entities/post-tag.entity';
import { PostEntity } from '@/core/entities/post.entity';
import { AuditEvent } from '@/core/events';
import {
  PageDto,
  PostCreateDto,
  PostDto,
  PostQueryDto,
  PostStatus,
  PostUpdateDto,
  QueryDto,
} from '@/core/models';
import {
  POST_REVISION_SERVICE,
  PostRevisionService,
  PostService,
} from '@/core/services';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TypeormPostService implements PostService {
  constructor(
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(PostMetaEntity)
    private postMetaRepo: Repository<PostMetaEntity>,
    @Inject(POST_REVISION_SERVICE)
    private postRevisionService: PostRevisionService,
  ) {}

  async create(values: PostCreateDto): Promise<number> {
    if (values.authors.length === 0) {
      throw new DomainError('Required at least one author');
    }

    const postId = await this.dataSource.transaction(async (em) => {
      const result = await em.insert(PostEntity, {
        cover: values.cover,
        title: values.title,
        excerpt: values.excerpt,
        lexical: values.lexical,
        slug: await normalizeSlug({
          value: values.slug,
          exists: (v) => {
            return em.existsBy(PostEntity, { slug: v });
          },
        }),
      });

      const postId = result.identifiers[0].id;

      const postAuthors = values.authors.map((id, i) => {
        return {
          authorId: id,
          postId: postId,
          sortOrder: i,
        } as PostAuthorEntity;
      });

      await em.insert(PostAuthorEntity, postAuthors);

      if (values.tags && values.tags.length > 0) {
        const postTags = values.tags.map((id, i) => {
          return {
            postId: postId,
            tagId: id,
            sortOrder: i,
          } as PostTagEntity;
        });
        await em.insert(PostTagEntity, postTags);
      }

      await em.insert(PostMetaEntity, {
        id: postId,
      });

      return postId;
    });

    this.eventEmitter.emit(
      'audit.created',
      new AuditEvent({
        resourceId: `${postId}`,
        resourceType: 'post',
        context: JSON.stringify({ title: values.title ?? '(Untitled)' }),
      }),
    );

    return postId;
  }

  async update(values: PostUpdateDto): Promise<PostDto> {
    const postId = values.id;
    const entity = await this.postRepo.findOneBy({ id: postId });

    if (!entity) {
      throw new DomainError('Post not found');
    }

    const dbUpdatedAt = new Date(entity.updatedAt).getTime();
    const userUpdatedAt = new Date(values.updatedAt).getTime();

    if (dbUpdatedAt > userUpdatedAt) {
      throw new DomainError('Update conflict by another user. Please refresh.');
    }

    await this.dataSource.transaction(async (em) => {
      await em.update(PostEntity, postId, {
        title: values.title,
        cover: values.cover ?? null,
        excerpt: values.excerpt,
        lexical: values.lexical,
        visibility: values.visibility,
        wordCount: values.wordCount,
        publishedAt: values.publishedAt ? new Date(values.publishedAt) : null,
        slug:
          entity.slug !== values.slug
            ? await normalizeSlug({
                value: values.slug,
                exists: (v) => {
                  return em.existsBy(PostEntity, { slug: v });
                },
              })
            : undefined,
      });

      if (values.authors) {
        const postAuthors = values.authors.map((id, i) => {
          return {
            authorId: id,
            postId: postId,
            sortOrder: i,
          } as PostAuthorEntity;
        });

        await em.delete(PostAuthorEntity, { postId: postId });
        await em.insert(PostAuthorEntity, postAuthors);
      }

      if (values.tags) {
        const postTags = values.tags.map((id, i) => {
          return {
            postId: postId,
            tagId: id,
            sortOrder: i,
          } as PostTagEntity;
        });
        await em.delete(PostTagEntity, { postId: postId });
        await em.insert(PostTagEntity, postTags);
      }
    });

    const newPost = await this.findById(postId);

    if (!newPost) {
      throw new DomainError('Post not found');
    }

    this.postRevisionService.save(entity.toDto(), newPost);

    const lastUpdatedAt = dbUpdatedAt / 1000;
    const currentUpdatedAt =
      new Date(newPost.audit!.updatedAt).getTime() / 1000;
    const timeSince = currentUpdatedAt - lastUpdatedAt;

    if (newPost.status === PostStatus.DRAFT && timeSince <= 900) {
      return newPost;
    }

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: `${postId}`,
        resourceType: 'post',
        context: JSON.stringify({ title: newPost.title ?? '(Untitled)' }),
      }),
    );

    return newPost;
  }

  async publish(userId: string, postId: number): Promise<void> {
    const entity = await this.postRepo.findOneBy({ id: postId });
    if (!entity) {
      throw new DomainError('Post not found');
    }

    const now = new Date();
    now.setMilliseconds(0);

    await this.postRepo.update(postId, {
      status: PostStatus.PUBLISHED,
      publishedBy: userId,
      publishedAt: entity.publishedAt ?? now,
    });
  }

  async unpublish(postId: number): Promise<void> {
    const exists = await this.postRepo.existsBy({ id: postId });
    if (!exists) {
      throw new DomainError('Post not found');
    }

    await this.postRepo.update(postId, {
      status: PostStatus.DRAFT,
    });
  }

  async delete(id: number): Promise<void> {
    const entity = await this.postRepo.findOneBy({ id: id });

    if (!entity) {
      throw new DomainError('Post not found');
    }

    await this.dataSource.transaction(async (em) => {
      await em.delete(PostEntity, id);
    });

    this.eventEmitter.emit(
      'audit.deleted',
      new AuditEvent({
        resourceId: `${id}`,
        resourceType: 'post',
        context: JSON.stringify({ title: entity.title ?? '(Untitled)' }),
      }),
    );
  }

  async findById(id: number): Promise<PostDto | undefined> {
    const entity = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authors', 'post_author')
      .leftJoinAndSelect('post.tags', 'post_tag')
      .leftJoinAndSelect('post_author.author', 'author')
      .leftJoinAndSelect('post_tag.tag', 'tag')
      .where('post.id = :id', { id })
      .getOne();

    return entity?.toDto();
  }

  async findBySlug(slug: string): Promise<PostDto | undefined> {
    const entity = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.meta', 'meta')
      .leftJoinAndSelect('post.authors', 'post_author')
      .leftJoinAndSelect('post.tags', 'post_tag')
      .leftJoinAndSelect('post_author.author', 'author')
      .leftJoinAndSelect('post_tag.tag', 'tag')
      .where('post.slug = :slug', { slug })
      .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
      .getOne();

    if (entity) {
      this.postMetaRepo.increment({ id: entity.id }, 'viewCount', 1);
    }
    return entity?.toDto();
  }

  async find(query: PostQueryDto): Promise<PageDto<PostDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const tags = transformToArray(query.tag);

    const baseQuery = this.postRepo.createQueryBuilder('post');

    // const baseQuery = this.postRepo
    //   .createQueryBuilder('post')
    //   .leftJoinAndSelect('post.meta', 'meta')
    //   .leftJoinAndSelect('post.authors', 'post_author')
    //   .leftJoinAndSelect('post.tags', 'post_tag')
    //   .leftJoinAndSelect('post_author.author', 'author')
    //   .leftJoinAndSelect('post_tag.tag', 'tag');

    if (query.status) {
      baseQuery.andWhere('post.status = :status', { status: query.status });
    }

    if (query.visibility) {
      baseQuery.andWhere('post.visibility = :visibility', {
        visibility: query.visibility,
      });
    }

    if (query.featured) {
      baseQuery.andWhere('post.featured = :featured', {
        featured: query.featured,
      });
    }

    if (query.author) {
      baseQuery.andWhere('post_author.authorId = :authorId', {
        authorId: query.author,
      });
    }

    if (tags) {
      baseQuery.andWhere('post_tag.tagId IN(:...tags)', {
        tags: tags.filter((v) => !isNaN(v)),
      });
    }

    if (query.q) {
      baseQuery.andWhere('LOWER(post.title) LIKE LOWER(:title)', {
        title: `%${query.q}%`,
      });
    }

    // if (query.orderBy === 'publishedAt') {
    //   baseQuery.addOrderBy(`post.publishedAt`, 'DESC');
    // } else {
    //   baseQuery.addOrderBy(`post.${query.orderBy ?? 'createdAt'}`, 'DESC');
    // }

    baseQuery.addOrderBy(`post.${query.orderBy ?? 'createdAt'}`, 'DESC');

    const idQuery = baseQuery.clone();
    const dataQuery = baseQuery.clone();

    idQuery
      .leftJoin('post.meta', 'meta')
      .leftJoin('post.authors', 'post_author')
      .leftJoin('post.tags', 'post_tag');

    const count = await idQuery.getCount();

    idQuery
      .select(['post.id', `post.${query.orderBy ?? 'createdAt'}`])
      .distinct();

    idQuery.offset(offset).limit(limit);

    const idList = await idQuery.getMany();

    let list: PostEntity[] = [];

    if (idList.length > 0) {
      dataQuery
        .andWhereInIds(idList.map((e) => e.id))
        .leftJoinAndSelect('post.meta', 'meta')
        .leftJoinAndSelect('post.authors', 'post_author')
        .leftJoinAndSelect('post.tags', 'post_tag')
        .leftJoinAndSelect('post_author.author', 'author')
        .leftJoinAndSelect('post_tag.tag', 'tag');

      list = await dataQuery.getMany();
    }

    return PageDto.from<PostDto>({
      list: list.map((e) => {
        return e.toDto();
      }),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
