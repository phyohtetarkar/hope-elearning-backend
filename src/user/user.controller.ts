import { Staff } from '@/common/decorators';
import { UserQueryDto } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Query,
  UseInterceptors,
} from '@nestjs/common';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/admin/users')
@Staff()
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Get()
  async find(@Query() query: UserQueryDto) {
    return await this.userService.find(query);
  }
}
