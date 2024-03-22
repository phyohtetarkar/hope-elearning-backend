import { PAGE_SIZE } from '@/common/constants';
import { Page } from '@/common/models/page.domain';
import { normalizeSlug, stringToSlug } from '@/common/utils';
import { CreateUserInput } from '@/user/models/create-user.input';
import { UpdateUserInput } from '@/user/models/update-user.input';
import { UserDto } from '@/user/models/user.dto';
import { User } from '@/user/models/user.entity';
import { UserQuery } from '@/user/models/user.query';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Raw, Repository } from 'typeorm';
import { UserService } from '../user.service';

@Injectable()
export class TypeormUserService implements UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(values: CreateUserInput): Promise<UserDto> {
    const entity = new User();
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

    const result = await this.userRepo.save(entity);

    return result.toDto();
  }

  async update(id: string, values: UpdateUserInput): Promise<void> {
    const exists = await this.userRepo.existsBy({ id: id });
    if (!exists) {
      throw 'User not found';
    }

    const duplicate = await this.userRepo.existsBy({
      id: Not(id),
      username: values.username,
    });

    if (duplicate) {
      throw 'Username already taken';
    }

    await this.userRepo.update(
      { id: id },
      {
        fullName: values.fullName,
        username: values.username,
        headline: values.headline,
      },
    );
  }

  async findById(id: string): Promise<UserDto | null> {
    const entity = await this.userRepo.findOneBy({ id: id });
    return entity ? entity.toDto() : null;
  }

  async findAll(query: UserQuery): Promise<Page<UserDto>> {
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
