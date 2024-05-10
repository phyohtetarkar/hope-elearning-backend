import { DomainError } from '@/common/errors';
import { normalizeSlug } from '@/common/utils';
import { UserEntity } from '@/core/entities/user.entity';
import {
  PageDto,
  QueryDto,
  UserCreateDto,
  UserDto,
  UserQueryDto,
  UserRole,
  UserUpdateDto,
} from '@/core/models';
import { UserService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';

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

  async update(values: UserUpdateDto): Promise<void> {
    const exists = this.userRepo.existsBy({ id: values.id });
    if (!exists) {
      throw new DomainError('User not found');
    }

    await this.userRepo.update(values.id, {
      id: values.id,
      nickname: values.nickname,
      username: await normalizeSlug(values.nickname, (v) => {
        return this.userRepo.existsBy({ id: Not(values.id), username: v });
      }),
      headline: values.headline ?? null,
      bio: values.bio ?? null,
    });
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    const exists = await this.userRepo.existsBy({ id: userId });
    if (!exists) {
      throw new DomainError('User not found');
    }

    await this.userRepo.update(userId, {
      role: role,
    });
  }

  async updateImage(userId: string, image: string): Promise<void> {
    const exists = await this.userRepo.existsBy({ id: userId });
    if (!exists) {
      throw new DomainError('User not found');
    }

    await this.userRepo.update(userId, {
      image: image,
    });
  }

  async findById(id: string): Promise<UserDto | undefined> {
    const entity = await this.userRepo.findOneBy({ id: id });
    return entity?.toDto();
  }

  async findByUsername(username: string): Promise<UserDto | undefined> {
    const entity = await this.userRepo.findOneBy({ username: username });
    return entity?.toDto();
  }

  async find(query: UserQueryDto): Promise<PageDto<UserDto>> {
    const { limit, offset } = QueryDto.getPageable(query);

    const userQuery = this.userRepo.createQueryBuilder('user');

    if (query.staffOnly) {
      userQuery.andWhere('user.role != :role', { role: UserRole.USER });
    } else if (query.role) {
      userQuery.andWhere('user.role = :role', { role: query.role });
    }

    if (query.email) {
      userQuery.andWhere('user.email = :email', { email: query.email });
    }

    if (query.name) {
      userQuery.andWhere('LOWER(user.nickname) LIKE LOWER(:name)', {
        name: query.name,
      });
    }

    const [list, count] = await userQuery
      .orderBy('user.createdAt', 'DESC')
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

    return PageDto.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
