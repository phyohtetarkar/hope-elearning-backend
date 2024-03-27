import { IsNotEmpty } from 'class-validator';

export class CookieLoginInput {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;
}
