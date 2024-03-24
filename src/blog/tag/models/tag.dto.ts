import { Audit } from '@/common/models/auditing.domain';

export class TagDto {
  id: number;
  slug: string;
  name: string;
  audit?: Audit;

  constructor(partial: Partial<TagDto> = {}) {
    Object.assign(this, partial);
  }
}
