import { Audit } from '@/common/models/auditing.domain';
import { UserRole } from './user-role.enum';

export class UserDto {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  email?: string;
  phone?: string;
  headline?: string;
  image?: string;
  bio?: string;
  audit?: Audit;

  constructor(partial: Partial<UserDto> = {}) {
    Object.assign(this, partial);
  }
}
