import { Expose } from 'class-transformer';
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
  nickname: string;
  username: string;
  role: UserRole;
  email: string;
  headline?: string;
  image?: string;

  @Expose({ groups: ['detail'] })
  bio?: string;

  audit?: AuditingDto;

  constructor(partial: Partial<UserDto> = {}) {
    Object.assign(this, partial);
  }

  isAdminOrOwner(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.OWNER;
  }
}
