import { PageDto, UserCreateDto, UserDto, UserQueryDto } from '../models';

export interface UserService {
  create(values: UserCreateDto): Promise<UserDto>;

  findById(id: string): Promise<UserDto | null>;

  findByUsername(username: string): Promise<UserDto | null>;

  find(query: UserQueryDto): Promise<PageDto<UserDto>>;
}

export const USER_SERVICE = 'UserService';