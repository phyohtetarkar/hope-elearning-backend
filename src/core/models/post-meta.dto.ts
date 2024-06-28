export class PostMetaDto {
  viewCount: string;

  constructor(partial: Partial<PostMetaDto> = {}) {
    Object.assign(this, partial);
  }
}
