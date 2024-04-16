import { USER_SERVICE, UserService } from '@/core/services';
import { Controller, Inject, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(@Inject(USER_SERVICE) private userService: UserService) {}

  @Post()
  async update() {
    await this.userService.create({
      id: 'cartoon-3',
      nickname: 'Ko Ko',
    });
  }
}
