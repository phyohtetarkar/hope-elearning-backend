import { Role } from './user.dto';

export class UserQuery {
  name?: string;
  email?: string;
  role?: Role;
  page?: number;
}
