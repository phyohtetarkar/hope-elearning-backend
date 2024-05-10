export class PageDto<T> {
  contents: T[];
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalElements: number;

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
    if (limit <= 0) {
      return new PageDto({
        contents: list,
        currentPage: count > 0 ? 1 : 0,
        totalPage: count > 0 ? 1 : 0,
        pageSize: count,
        totalElements: count,
      });
    }
    const totalPage = Math.ceil(count / limit);
    return new PageDto({
      contents: list,
      // prettier-ignore
      currentPage: count > 0 ? (offset / limit) + 1 : 0,
      totalPage: totalPage,
      pageSize: list.length,
      totalElements: count,
    });
  }
}
