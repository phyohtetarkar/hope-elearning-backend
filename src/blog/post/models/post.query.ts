import { PostStatus } from './post-status.enum';

export class PostQuery {
  q?: string;
  authorId?: string;
  status?: PostStatus;
  featured?: boolean;
  page?: number;
}
