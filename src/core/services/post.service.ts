import {
  PageDto,
  PostCreateDto,
  PostDto,
  PostQueryDto,
  PostUpdateDto,
} from '../models';

export interface PostService {
  create(values: PostCreateDto): Promise<number>;

  update(values: PostUpdateDto): Promise<PostDto>;

  publish(userId: string, postId: number): Promise<void>;

  unpublish(postId: number): Promise<void>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<PostDto | undefined>;

  findBySlug(slug: string): Promise<PostDto | undefined>;

  find(query: PostQueryDto): Promise<PageDto<PostDto>>;
}

export const POST_SERVICE = 'PostService';
