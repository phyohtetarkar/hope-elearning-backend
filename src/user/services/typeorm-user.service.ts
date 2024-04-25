import { normalizeSlug } from '@/common/utils';
import { UserEntity } from '@/core/entities/user.entity';
import {
  PageDto,
  QueryDto,
  UserCreateDto,
  UserDto,
  UserQueryDto,
  UserRole,
} from '@/core/models';
import { UserService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Raw, Repository } from 'typeorm';

@Injectable()
export class TypeormUserService implements UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(values: UserCreateDto): Promise<UserDto> {
    const result = await this.userRepo.insert({
      id: values.id,
      nickname: values.nickname,
      email: values.email,
      username: await normalizeSlug(values.nickname, (v) => {
        return this.userRepo.existsBy({ username: v });
      }),
      image: values.image,
    });

    const userId = result.identifiers[0].id;

    const user = await this.userRepo.findOneByOrFail({ id: userId });

    return user.toDto();
  }

  async findById(id: string): Promise<UserDto | null> {
    const entity = await this.userRepo.findOneBy({ id: id });
    return entity?.toDto() ?? null;
  }

  async findByUsername(username: string): Promise<UserDto | null> {
    const entity = await this.userRepo.findOneBy({ username: username });
    return entity?.toDto() ?? null;
  }

  async find(query: UserQueryDto): Promise<PageDto<UserDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const [list, count] = await this.userRepo.findAndCount({
      where: {
        role: query.staffOnly ? Not(UserRole.USER) : query.role,
        email: query.email,
        nickname: query.name
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
