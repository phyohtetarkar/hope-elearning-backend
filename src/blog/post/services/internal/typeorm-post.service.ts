import { TagEntity } from '@/blog/tag/models/tag.entity';
import { PAGE_SIZE } from '@/common/constants';
import { Page } from '@/common/models/page.domain';
import { normalizeSlug, stringToSlug } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostStatus } from '../../models/post-status.enum';
import { PostTagEntity } from '../../models/post-tag.entity';
import { PostUpdateInput } from '../../models/post-update.input';
import { PostDto } from '../../models/post.dto';
import { PostEntity } from '../../models/post.entity';
import { PostQuery } from '../../models/post.query';
import { PostService } from '../post.service';

@Injectable()
export class TypeormPostService implements PostService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(PostTagEntity)
    private postTagRepo: Repository<PostTagEntity>,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async save(values: PostUpdateInput): Promise<PostDto> {
    const entity = new PostEntity();
    entity.id = values.id;
    entity.cover = values.cover;
    entity.title = values.title;
    entity.excerpt = values.excerpt;
    entity.body = values.body;
    entity.author.id = values.authorId;
    entity.slug = await normalizeSlug(stringToSlug(values.title), (v) => {
      return this.postRepo.existsBy({ slug: v });
    });

    // entity.tag

    const result = await this.postRepo.save(entity);

    return result.toDto();
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
        //q
        //author
        status: query.status,
        featured: query.featured,
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
