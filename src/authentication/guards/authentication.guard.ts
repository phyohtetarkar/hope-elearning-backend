import { AuthUserStore } from '@/common/als/auth-user.store';
import { IS_PUBLIC_KEY } from '@/common/decorators';
import { USER_SERVICE, UserService } from '@/user/services/user.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from 'express';
import {
  EXTERNAL_AUTH_SERVICE,
  ExternalAuthService,
} from '../services/external-auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private als: AsyncLocalStorage<AuthUserStore>,
    private reflector: Reflector,
    @Inject(EXTERNAL_AUTH_SERVICE)
    private authService: ExternalAuthService,
    @Inject(USER_SERVICE)
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const uid = await this.authService.verifyToken(token);

    if (!uid) {
      throw new UnauthorizedException();
    }

    let user = await this.userService.findById(uid);

    if (!user) {
      // first time user sync
      const authUser = await this.authService.getUser(uid);

      if (!authUser) {
        throw new UnauthorizedException();
      }

      user = await this.userService.create({ ...authUser });
    }

    request['user'] = user;

    const store = this.als.getStore();
    if (store) {
      store.user = user;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
