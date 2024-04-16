import { UserDto } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Get, Inject, Req } from '@nestjs/common';

@Controller('profile')
export class UserProfileController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Get()
  getUser(@Req() request: Request) {
    return request['user'] as UserDto;
  }
}
