import { UserRole } from '@/user/models/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const HAS_ANY_ROLE_KEY = 'has_any_role';
export const HasAnyRole = (...roles: UserRole[]) =>
  SetMetadata(HAS_ANY_ROLE_KEY, roles);
