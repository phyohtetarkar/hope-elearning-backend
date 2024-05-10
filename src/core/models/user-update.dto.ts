import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  id: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  username: string;

  headline?: string;

  bio?: string;
}
