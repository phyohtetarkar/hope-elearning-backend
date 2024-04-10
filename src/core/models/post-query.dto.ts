import { PostAccess, PostStatus } from './post.dto';
import { QueryDto } from './query.dto';

export class PostQueryDto extends QueryDto {
  q?: string;
  authorId?: string;
  tagId?: number;
  status?: PostStatus;
  access?: PostAccess;
  featured?: boolean;

  constructor(partial: Partial<PostQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
