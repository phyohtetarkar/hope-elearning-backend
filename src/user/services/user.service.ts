import { Page } from '@/common/models/page.domain';
import { UpdateUserInput } from '../models/update-user.input';
import { UserDto } from '../models/user.dto';
import { UserQuery } from '../models/user.query';
import { CreateUserInput } from '../models/create-user.input';

export interface UserService {
  create(values: CreateUserInput): Promise<UserDto>;

  update(id: string, values: UpdateUserInput): Promise<void>;

  findById(id: string): Promise<UserDto | null>;

  findAll(query: UserQuery): Promise<Page<UserDto>>;
}

export const USER_SERVICE = 'UserService';
