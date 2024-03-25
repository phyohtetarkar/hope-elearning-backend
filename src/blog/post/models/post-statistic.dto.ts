export class PostStatisticDto {
  totalView: number;

  constructor(partial: Partial<PostStatisticDto> = {}) {
    Object.assign(this, partial);
  }
}
