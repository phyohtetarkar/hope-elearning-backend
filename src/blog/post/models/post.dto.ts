import { TagDto } from '@/blog/tag/models/tag.dto';
import { Audit } from '@/common/models/auditing.domain';
import { UserDto } from '@/user/models/user.dto';
import { PostStatus } from './post-status.enum';

export class PostDto {
  id: number;
  cover?: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: string;
  status: PostStatus;
  publishedAt: number;
  author: UserDto;
  tags: TagDto[];
  audit?: Audit;
}
