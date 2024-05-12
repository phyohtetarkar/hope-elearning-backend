import { ApiOkResponsePaginated, Roles } from '@/common/decorators';
import { UserDto, UserQueryDto, UserRole } from '@/core/models';
import { USER_SERVICE, UserService } from '@/core/services';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Put,
  Query,
} from '@nestjs/common';
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

  @Put(':id/role')
  async updateRole(
    @Param('id') userId: string,
    @Body('role', new ParseEnumPipe(UserRole)) role: UserRole,
  ) {
    if (role === UserRole.OWNER) {
      throw new BadRequestException('Owner role grant is forbidden');
    }
    await this.userService.updateRole(userId, role);
  }
}
