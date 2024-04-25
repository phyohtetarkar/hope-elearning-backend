import {
  PageDto,
  PostCreateDto,
  PostDto,
  PostQueryDto,
  PostStatus,
  PostUpdateDto,
} from '../models';

export interface PostService {
  create(values: PostCreateDto): Promise<number>;

  update(values: PostUpdateDto): Promise<PostDto>;

  updateStatus(id: number, status: PostStatus): Promise<void>;

  delete(id: number): Promise<void>;

  existsByIdAndAuthor(id: number, authorId: string): Promise<boolean>;

  findById(id: number): Promise<PostDto | null>;

  findBySlug(slug: string): Promise<PostDto | null>;

  find(query: PostQueryDto): Promise<PageDto<PostDto>>;
}

export const POST_SERVICE = 'PostService';
