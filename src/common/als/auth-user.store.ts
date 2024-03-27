import { UserRole } from '@/user/models/user-role.enum';

export class AuthUserStore {
  userId?: string;
  role?: UserRole;
}
