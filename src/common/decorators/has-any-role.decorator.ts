import { Role } from '@/user/models/user.dto';
import { SetMetadata } from '@nestjs/common';

export const HAS_ANY_ROLE_KEY = 'has_any_role';
export const HasAnyRole = (...roles: Role[]) =>
  SetMetadata(HAS_ANY_ROLE_KEY, roles);
