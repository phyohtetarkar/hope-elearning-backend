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
  USER_SERVICE,
  UserService,
} from '@/user/services/user.service';
import { FirebaseAuthService } from '../firebase/firebase-auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SecurityContext } from '@/common';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private als: AsyncLocalStorage<SecurityContext>,
    private reflector: Reflector,
    private authService: FirebaseAuthService,
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
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const decodedToken = await this.authService.verifyToken(token);

    if (!decodedToken) {
      throw new UnauthorizedException();
    }

    const uid = decodedToken.uid;

    let user = await this.userService.findById(uid);

    if (!user) {
      // first time user sync
      const authUser = await this.authService.getUser(uid);

      if (!authUser) {
        throw new UnauthorizedException();
      }

      user = await this.userService.create({
        id: authUser.uid,
        fullName: authUser.displayName ?? 'User',
        email: authUser.email,
        phone: authUser.phoneNumber,
      });
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

  private extractTokenFromCookie(request: Request): string | undefined {
    const accessToken = request.cookies['access_token'];
    return accessToken;
  }
}
