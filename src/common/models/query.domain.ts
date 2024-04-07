import { PAGE_SIZE } from '../constants';

export class Query {
  page?: number;
  size?: number;

  getPageable() {
    const page = (this.page ?? 1) - 1;
    const limit = this.size ?? PAGE_SIZE;
    const offset = (page >= 0 ? page : 0) * limit;
    return {
      limit: limit > 0 ? limit : PAGE_SIZE,
      offset: offset,
    };
  }
}
