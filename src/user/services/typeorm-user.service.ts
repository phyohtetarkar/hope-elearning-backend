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
import { FirebaseService } from '@/core/security/firebase.service';
import { UserService } from '@/core/services';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class TypeormUserService implements UserService, OnApplicationBootstrap {
  constructor(
    private dataSource: DataSource,
    private firebaseServce: FirebaseService,
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const uid = this.configService.get<string>('SUPER_USER_ID');
      const name = this.configService.get<string>('SUPER_USER_NAME');
      if (!uid) {
        return;
      }

      const exists = await this.userRepo.existsBy({
        id: uid,
      });

      if (exists) {
        return;
      }

      const user = await this.firebaseServce.getUser(uid);

      if (!user) {
        return;
      }

      const nickname = name ?? 'Super User';

      await this.userRepo.insert({
        id: user.uid,
        nickname: nickname,
        email: user.email,
        username: await normalizeSlug({
          value: nickname,
          exists: (v) => {
            return this.userRepo.existsBy({ username: v });
          },
        }),
      });

      console.log('Super user created:', user.email);
    } catch (error) {
      console.error('Failed to create super user:', error.message);
    }
  }

  async create(values: UserCreateDto): Promise<UserDto> {
    const result = await this.userRepo.insert({
      id: values.id,
      nickname: values.nickname,
      email: values.email,
      username: await normalizeSlug({
        value: values.nickname,
        exists: (v) => {
          return this.userRepo.existsBy({ username: v });
        },
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
      username: await normalizeSlug({
        value: values.username,
        exists: (v) => {
          return this.userRepo.existsBy({ id: Not(values.id), username: v });
        },
      }),
      headline: values.headline ?? null,
      bio: values.bio ?? null,
      image: values.image,
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
