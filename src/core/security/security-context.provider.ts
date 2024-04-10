import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { SecurityContext } from './security-context.domain';

@Injectable()
export class SecurityContextProvider {
  constructor(private als: AsyncLocalStorage<SecurityContext>) {}
  getAuthenticatedUser() {
    const user = this.als.getStore()?.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  getAuthenticatedUserOpt() {
    return this.als.getStore()?.user;
  }
}
