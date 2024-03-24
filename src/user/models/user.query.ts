import { UserRole } from './user-role.enum';

export class UserQuery {
  name?: string;
  email?: string;
  role?: UserRole;
  page?: number;
}
