import { IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  headline?: string;

  bio?: string;
}