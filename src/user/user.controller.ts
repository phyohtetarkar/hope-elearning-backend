import { Public } from '@/common/decorators';
import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Public()
  @Post()
  async update() {
    await this.userService.create({
      id: 'cartoon-3',
      fullName: 'Ko Ko',
    });
  }
}
