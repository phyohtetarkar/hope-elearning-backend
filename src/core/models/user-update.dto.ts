import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  @ApiHideProperty()
  id: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  username: string;

  headline?: string;

  bio?: string;
}
