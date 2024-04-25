import { Expose, Transform } from 'class-transformer';
import { AuditingDto } from './auditing.dto';
import { TagDto } from './tag.dto';
import { UserDto } from './user.dto';

export enum PostVisibility {
  PUBLIC = 'public',
  MEMBER = 'member',
  PAID_MEMBER = 'paid_member',
}

export enum PostStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  PUBLISHED = 'published',
  DISABLED = 'disabled',
}

export class PostDto {
  @Transform(({ value }) => Number(value))
  id: number;
  cover?: string;
  title: string;
  slug: string;
  excerpt: string;

  @Expose({ groups: ['detail'] })
  lexical?: string;

  status: PostStatus;

  visibility: PostVisibility;

  featured: boolean;
  publishedAt?: number;
  authors: UserDto[];
  tags: TagDto[];
  audit?: AuditingDto;

  constructor(partial: Partial<PostDto> = {}) {
    Object.assign(this, partial);
  }
}
