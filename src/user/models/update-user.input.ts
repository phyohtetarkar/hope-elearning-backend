import { IsNotEmpty } from 'class-validator';

export class UpdateUserInput {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  username: string;

  headline?: string;
}
