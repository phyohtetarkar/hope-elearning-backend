import { Page, normalizeSlug, stringToSlug } from '@/common';
import { UserEntity } from '@/common/entities/user.entity';
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
    const result = await this.userRepo.insert({
      id: values.id,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      username: await normalizeSlug(stringToSlug(values.fullName), (v) => {
        return this.userRepo.existsBy({ username: v });
      }),
    });

    console.log(result);

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

  async find(query: UserQuery): Promise<Page<UserDto>> {
    const { limit, offset } = query.getPageable();

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
