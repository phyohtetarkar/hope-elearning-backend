import { AuditingDto } from './auditing.dto';

export enum UserRole {
  USER = 'user',
  CONTRIBUTOR = 'contributor',
  AUTHOR = 'author',
  ADMIN = 'admin',
  OWNER = 'owner',
}

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
  audit?: AuditingDto;

  constructor(partial: Partial<UserDto> = {}) {
    Object.assign(this, partial);
  }

  static isAdminOrOwner(user: UserDto): boolean {
    return user.role === UserRole.ADMIN || user.role === UserRole.OWNER;
  }
}
