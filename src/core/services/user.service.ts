import {
  PageDto,
  UserCreateDto,
  UserDto,
  UserQueryDto,
  UserRole,
} from '../models';

export interface UserService {
  create(values: UserCreateDto): Promise<UserDto>;

  updateRole(userId: string, role: UserRole): Promise<void>;

  findById(id: string): Promise<UserDto | undefined>;

  findByUsername(username: string): Promise<UserDto | undefined>;

  find(query: UserQueryDto): Promise<PageDto<UserDto>>;
}

export const USER_SERVICE = 'UserService';
