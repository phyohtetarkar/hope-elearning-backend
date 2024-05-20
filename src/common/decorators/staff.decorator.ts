import { UserRole } from '@/core/models';
import { applyDecorators } from '@nestjs/common';
import { Roles } from './roles.decorator';

export const Staff = () =>
  applyDecorators(
    Roles(
      UserRole.OWNER,
      UserRole.ADMIN,
      UserRole.AUTHOR,
      UserRole.CONTRIBUTOR,
    ),
  );
