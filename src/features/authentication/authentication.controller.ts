import { Body, Controller, Post, Res } from '@nestjs/common';
import { CookieLoginInput } from './models/cookie-login.input';
import { Response } from 'express';
import { Public } from '@/security/decorators/public.decorator';

@Controller('auth')
export class AuthenticationController {
  @Public()
  @Post('cookie-login')
  async cookieLogin(
    @Res({ passthrough: true }) response: Response,
    @Body() values: CookieLoginInput,
  ) {
    response.cookie('access-token', {});
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {}
}
