import { QueryDto } from './query.dto';
import { UserRole } from './user.dto';

export class UserQueryDto extends QueryDto {
  name?: string;
  email?: string;
  role?: UserRole;
}
