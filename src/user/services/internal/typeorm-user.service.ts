import { AuthUserStore } from '@/common/als/auth-user.store';
import { PAGE_SIZE } from '@/common/constants';
import { DomainError } from '@/common/errors/domain.error';
import { Page } from '@/common/models/page.domain';
import { normalizeSlug, stringToSlug } from '@/common/utils';
import { CreateUserInput } from '@/user/models/create-user.input';
import { UpdateUserInput } from '@/user/models/update-user.input';
import { UserDto } from '@/user/models/user.dto';
import { UserEntity } from '@/user/models/user.entity';
import { UserQuery } from '@/user/models/user.query';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, Not, Raw, Repository } from 'typeorm';
import { UserService } from '../user.service';

@Injectable()
export class TypeormUserService implements UserService {
  constructor(
    private dataSource: DataSource,
    private als: AsyncLocalStorage<AuthUserStore>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(values: CreateUserInput): Promise<UserDto> {
    const entity = new UserEntity();
    entity.id = values.id;
    entity.fullName = values.fullName;
    entity.email = values.email;
    entity.phone = values.phone;
    entity.username = await normalizeSlug(
      stringToSlug(values.fullName),
      (v) => {
        return this.userRepo.existsBy({ username: v });
      },
    );

    const result = await this.userRepo.insert(entity);

    console.log(result);

    return new UserDto();
  }

  async update(values: UpdateUserInput): Promise<void> {
    if (values.id !== this.als.getStore()?.userId) {
      throw new DomainError('User not found');
    }

    const exists = await this.userRepo.existsBy({ id: values.id });
    if (!exists) {
      throw new DomainError('User not found');
    }

    const duplicate = await this.userRepo.existsBy({
      id: Not(values.id),
      username: values.username,
    });

    if (duplicate) {
      throw new DomainError('Username already taken');
    }

    await this.userRepo.update(
      { id: values.id },
      {
        fullName: values.fullName,
        username: values.username,
        headline: values.headline ?? null,
        bio: values.bio ?? null,
      },
    );
  }

  async findById(id: string): Promise<UserDto | undefined> {
    const entity = await this.userRepo.findOneBy({ id: id });
    return entity?.toDto();
  }

  async findByUsername(username: string): Promise<UserDto | undefined> {
    const entity = await this.userRepo.findOneBy({ username: username });
    return entity?.toDto();
  }

  async find(query: UserQuery): Promise<Page<UserDto>> {
    const page = query.page ?? 0;
    const offset = page * PAGE_SIZE;
    const limit = PAGE_SIZE;

    const [list, count] = await this.userRepo.findAndCount({
      where: {
        role: query.role ? query.role : undefined,
        email: query.email ? query.email : undefined,
        fullName: query.name
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

    return Page.from({
      list: list.map((e) => e.toDto()),
      count: count,
      offset: offset,
      limit: limit,
    });
  }
}
