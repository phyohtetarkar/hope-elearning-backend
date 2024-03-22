import { Public } from '@/common/decorators';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { SingUpInput } from './models/sign-up.input';
import {
  AUTHENTICATION_SERVICE,
  AuthenticationService,
} from './services/authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject(AUTHENTICATION_SERVICE)
    private authService: AuthenticationService,
  ) {}

  @Public()
  @Post()
  async signUp(@Body() values: SingUpInput) {
    try {
      await this.authService.signUp(values);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
