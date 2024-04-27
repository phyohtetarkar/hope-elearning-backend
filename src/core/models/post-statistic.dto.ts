export class PostStatisticDto {
  totalView: string;

  constructor(partial: Partial<PostStatisticDto> = {}) {
    Object.assign(this, partial);
  }
}
