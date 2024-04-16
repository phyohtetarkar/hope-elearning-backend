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
    const totalPage = limit > 0 ? Math.ceil(count / limit) : 0;
    return new PageDto({
      contents: list,
      // prettier-ignore
      currentPage: limit > 0 ? (offset / limit) + 1 : 0,
      totalPage: totalPage,
      pageSize: list.length,
    });
  }
}
