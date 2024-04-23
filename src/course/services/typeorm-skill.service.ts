import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { SkillEntity } from '@/core/entities/skill.entity';
import {
  PageDto,
  QueryDto,
  SkillCreateDto,
  SkillDto,
  SkillQueryDto,
  SkillUpdateDto,
} from '@/core/models';
import { SkillService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Raw, Repository } from 'typeorm';

@Injectable()
export class TypeormSkillService implements SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private skillRepo: Repository<SkillEntity>,
  ) {}

  async create(values: SkillCreateDto): Promise<number> {
    const result = await this.skillRepo.insert({
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.skillRepo.existsBy({ slug: v });
      }),
    });

    return result.identifiers[0].id;
  }

  async update(values: SkillUpdateDto): Promise<number> {
    const exists = await this.skillRepo.existsBy({ id: values.id });

    if (!exists) {
      throw new DomainError('Skill not found');
    }

    await this.skillRepo.update(values.id, {
      name: values.name,
      slug: await normalizeSlug(values.slug, (v) => {
        return this.skillRepo.existsBy({ id: Not(values.id), slug: v });
      }),
    });

    return values.id;
  }

  async delete(id: number): Promise<void> {
    await this.skillRepo.delete({ id: id });
  }

  async findById(id: number): Promise<SkillDto | null> {
    const entity = await this.skillRepo.findOneBy({ id: id });
    return entity?.toDto() ?? null;
  }

  async findBySlug(slug: string): Promise<SkillDto | null> {
    const entity = await this.skillRepo.findOneBy({ slug: slug });
    return entity?.toDto() ?? null;
  }

  async find(query: SkillQueryDto): Promise<PageDto<SkillDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const [list, count] = await this.skillRepo.findAndCount({
      where: {
        name: query.name
          ? Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
              name: `${query.name}%`,
            })
          : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return PageDto.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
