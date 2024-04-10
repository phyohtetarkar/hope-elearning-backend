export class PageDto<T> {
  contents: T[];
  currentPage: number;
  totalPage: number;
  pageSize: number;

  constructor(partial: Partial<PageDto<T>> = {}) {
    Object.assign(this, partial);
  }

  static from<T>({
    list,
    count,
    offset = 0,
    limit = 0,
  }: {
    list: T[];
    count: number;
    offset?: number;
    limit?: number;
  }): PageDto<T> {
    const totalPage = Math.ceil(count / limit);
    return new PageDto({
      contents: list,
      // prettier-ignore
      currentPage: (offset / limit) + 1,
      totalPage: totalPage > 0 ? totalPage : 1,
      pageSize: list.length,
    });
  }
}
