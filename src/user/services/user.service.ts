import { Page } from '@/common/models/page.domain';
import { CreateUserInput } from '../models/create-user.input';
import { UpdateUserInput } from '../models/update-user.input';
import { UserDto } from '../models/user.dto';
import { UserQuery } from '../models/user.query';

export interface UserService {
  create(values: CreateUserInput): Promise<UserDto>;

  update(values: UpdateUserInput): Promise<void>;

  findById(id: string): Promise<UserDto | undefined>;

  findByUsername(username: string): Promise<UserDto | undefined>;

  find(query: UserQuery): Promise<Page<UserDto>>;
}

export const USER_SERVICE = 'UserService';
