export abstract class QueryDto {
  page?: number;
  size?: number;

  static getPageable(q: QueryDto) {
    const page = (q.page ?? 1) - 1;
    const limit = q.size;
    const offset = !!limit ? (page >= 0 ? page : 0) * limit : undefined;
    return {
      limit: limit,
      offset: offset,
    };
  }
}
