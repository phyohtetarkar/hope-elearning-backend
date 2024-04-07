import { Query } from '@/common';
import { UserRole } from './user-role.enum';

export class UserQuery extends Query {
  name?: string;
  email?: string;
  role?: UserRole;
}
