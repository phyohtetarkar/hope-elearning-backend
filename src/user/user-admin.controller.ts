import { ApiOkResponsePaginated, Roles } from '@/common/decorators';
import { UserDto, UserQueryDto, UserRole } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('/admin/users')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class UserAdminController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @ApiOkResponsePaginated(UserDto)
  @Get()
  async find(@Query() query: UserQueryDto) {
    return await this.userService.find(query);
  }
}
