import { PAGE_SIZE } from '@/common/constants';

import { Page, normalizeSlug, stringToSlug } from '@/common';
import { UserEntity } from '@/persistence/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';
import { UserCreateInput } from '../../models/user-create.input';
import { UserDto } from '../../models/user.dto';
import { UserQuery } from '../../models/user.query';
import { UserService } from '../user.service';

@Injectable()
export class TypeormUserService implements UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(values: UserCreateInput): Promise<UserDto> {
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
