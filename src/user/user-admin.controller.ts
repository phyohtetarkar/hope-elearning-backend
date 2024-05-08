import { Roles } from '@/common/decorators';
import { UserQueryDto, UserRole } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('/admin/users')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class UserAdminController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Get()
  async find(@Query() query: UserQueryDto) {
    return await this.userService.find(query);
  }
}
