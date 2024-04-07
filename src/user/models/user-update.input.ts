import { IsNotEmpty } from 'class-validator';

export class UserUpdateInput {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  headline?: string;

  bio?: string;
}
