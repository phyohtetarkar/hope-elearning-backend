import { FirebaseService } from '@/core/security/firebase.service';
import { USER_SERVICE, UserService } from '@/core/services';
import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(USER_SERVICE)
    private userService: UserService,
  ) {}

  @Post('verify-email')
  async verifyEmail(@Query('oobCode') oobCode: string) {
    const { uid, emailVerified } =
      await this.firebaseService.verifyEmail(oobCode);

    if (!emailVerified) {
      throw new BadRequestException('Email verification failed.');
    }

    await this.userService.updateEmailVerified(uid, emailVerified);

    return await this.userService.findById(uid);
  }
}
