import { UserRole } from '@/core/models';
import { SetMetadata } from '@nestjs/common';

export const STAFF_KEY = 'staff';
export const Staff = () =>
  SetMetadata(STAFF_KEY, [
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.AUTHOR,
    UserRole.CONTRIBUTOR,
  ]);
