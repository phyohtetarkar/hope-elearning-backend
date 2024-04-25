import { UserQueryDto } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('/admin/users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Get()
  async find(@Query() query: UserQueryDto) {
    return await this.userService.find(query);
  }
}
