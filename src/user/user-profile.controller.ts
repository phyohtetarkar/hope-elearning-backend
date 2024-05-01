import { UserDto } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Req,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UserProfileController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @SerializeOptions({
    groups: ['detail'],
  })
  @Get()
  getUser(@Req() request: Request) {
    return request['user'] as UserDto;
  }
}
