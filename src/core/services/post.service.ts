import {
  PageDto,
  PostCreateDto,
  PostDto,
  PostQueryDto,
  PostUpdateDto,
} from '../models';

export interface PostService {
  create(values: PostCreateDto): Promise<string>;

  update(values: PostUpdateDto): Promise<void>;

  publish(userId: string, postId: string): Promise<void>;

  unpublish(postId: string): Promise<void>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<PostDto | undefined>;

  findBySlug(slug: string): Promise<PostDto | undefined>;

  find(query: PostQueryDto): Promise<PageDto<PostDto>>;
}

export const POST_SERVICE = 'PostService';
