export class Page<T> {
  contents: T[];
  currentPage: number;
  totalPage: number;
  pageSize: number;

  constructor(partial: Partial<Page<T>> = {}) {
    Object.assign(this, partial);
  }

  static from<T>({
    list,
    count,
    offset,
    limit,
  }: {
    list: T[];
    count: number;
    offset: number;
    limit: number;
  }): Page<T> {
    return new Page({
      contents: list,
      // prettier-ignore
      currentPage: (offset / limit) + 1,
      totalPage: Math.ceil(count / limit),
      pageSize: list.length,
    });
  }
}
