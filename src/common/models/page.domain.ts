export class Page<T> {
  contents: T[];
  currentPage: number;
  totalPage: number;
  pageSize: number;

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
    return {
      contents: list,
      // eslint-disable-next-line prettier/prettier
      currentPage: offset / limit + 1,
      totalPage: Math.ceil(count / limit),
      pageSize: list.length,
    };
  }
}
