import { IsEnum, IsOptional } from 'class-validator';
import { PostStatus, PostVisibility } from './post.dto';
import { QueryDto } from './query.dto';

export class PostQueryDto extends QueryDto {
  q?: string;
  author?: string;
  tag?: number | number[];

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  featured?: boolean;

  orderBy?: 'publishedAt';

  constructor(partial: Partial<PostQueryDto> = {}) {
    super();
    Object.assign(this, partial);
  }
}
