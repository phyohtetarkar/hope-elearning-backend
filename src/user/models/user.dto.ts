import { Audit } from '@/common/models/auditing.domain';

export enum Role {
  USER = 'user',
  CONTRIBUTOR = 'contributor',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export class UserDto {
  id: string;
  fullName: string;
  username: string;
  role: Role;
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
