import { Query } from '@/common';
import { PostAccess } from './post-access.enum';
import { PostStatus } from './post-status.enum';

export class PostQuery extends Query {
  q?: string;
  authorId?: string;
  tagId?: number;
  status?: PostStatus;
  access?: PostAccess;
  featured?: boolean;
}
