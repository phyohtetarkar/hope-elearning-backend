import { Controller, Inject, Post } from '@nestjs/common';
import { USER_SERVICE, UserService } from './services/user.service';
import { Public } from '@/common/decorators/public.decorator';

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
