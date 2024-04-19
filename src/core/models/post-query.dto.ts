import { IsEnum, IsOptional } from 'class-validator';
import { PostAccess, PostStatus } from './post.dto';
import { QueryDto } from './query.dto';

export class PostQueryDto extends QueryDto {
  q?: string;
  authorId?: string;
  tagId?: number;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsEnum(PostAccess)
  access?: PostAccess;

  featured?: boolean;

  constructor(partial: Partial<PostQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
