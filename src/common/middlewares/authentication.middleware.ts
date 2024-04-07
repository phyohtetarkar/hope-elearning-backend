import { SecurityContext } from '@/common';
import { USER_SERVICE, UserService } from '@/user/services/user.service';
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { FirebaseAuthService } from '../firebase/firebase-auth.service';

@Injectable()
export class AuthenticationMiddleware
  implements NestMiddleware<Request, Response>
{
  constructor(
    private readonly als: AsyncLocalStorage<SecurityContext>,
    private authService: FirebaseAuthService,
    @Inject(USER_SERVICE)
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromCookie(req);

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

    req['user'] = user;

    const store: SecurityContext = { user: user };

    this.als.run(store, () => next());
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
