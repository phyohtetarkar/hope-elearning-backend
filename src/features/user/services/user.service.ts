import { Page } from '@/common';
import { UserCreateInput } from '../models/user-create.input';
import { UserDto } from '../models/user.dto';
import { UserQuery } from '../models/user.query';

export interface UserService {
  create(values: UserCreateInput): Promise<UserDto>;

  findById(id: string): Promise<UserDto | undefined>;

  findByUsername(username: string): Promise<UserDto | undefined>;

  find(query: UserQuery): Promise<Page<UserDto>>;
}

export const USER_SERVICE = 'UserService';
