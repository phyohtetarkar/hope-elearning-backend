import { Page } from '@/common';
import { PostStatus } from '../models/post-status.enum';
import { PostUpdateInput } from '../models/post-update.input';
import { PostDto } from '../models/post.dto';
import { PostQuery } from '../models/post.query';

export interface PostService {
  create(values: PostUpdateInput): Promise<number>;

  update(values: PostUpdateInput): Promise<number>;

  updateStatus(id: number, status: PostStatus): Promise<void>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<PostDto | null>;

  findBySlug(slug: string): Promise<PostDto | null>;

  find(query: PostQuery): Promise<Page<PostDto>>;
}

export const POST_SERVICE = 'PostService';
