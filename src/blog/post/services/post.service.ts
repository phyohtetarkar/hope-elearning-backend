import { Page } from '@/common/models/page.domain';
import { PostStatus } from '../models/post-status.enum';
import { PostUpdateInput } from '../models/post-update.input';
import { PostDto } from '../models/post.dto';
import { PostQuery } from '../models/post.query';

export interface PostService {
  save(values: PostUpdateInput): Promise<PostDto>;

  updateStatus(id: number, status: PostStatus): Promise<void>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<PostDto | null>;

  findBySlug(slug: string): Promise<PostDto | null>;

  find(query: PostQuery): Promise<Page<PostDto>>;
}

export const POST_SERVICE = 'PostService';
