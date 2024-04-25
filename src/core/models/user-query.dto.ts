import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { QueryDto } from './query.dto';
import { UserRole } from './user.dto';

export class UserQueryDto extends QueryDto {
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  staffOnly?: boolean;
}
