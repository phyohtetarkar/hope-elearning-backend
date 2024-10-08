import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { FirebaseService } from '../security/firebase.service';
import { JwtVerificationService } from '../security/jwt-verification.service';
import { SecurityContext } from '../security/security-context.domain';
import { USER_SERVICE, UserService } from '../services';

@Injectable()
export class AuthenticationMiddleware
  implements NestMiddleware<Request, Response>
{
  constructor(
    private als: AsyncLocalStorage<SecurityContext>,
    private jwtVerificationService: JwtVerificationService,
    private firebaseServce: FirebaseService,
    @Inject(USER_SERVICE)
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token =
        this.extractTokenFromHeader(req) ?? this.extractTokenFromCookie(req);

      if (!token) {
        throw new Error('Access token not found');
      }

      const { sub } = await this.jwtVerificationService.verify(token);

      if (!sub) {
        throw new Error('User not found');
      }

      let user = await this.userService.findById(sub);

      if (!user) {
        // first time user sync
        const authUser = await this.firebaseServce.getUser(sub);

        if (!authUser) {
          throw new Error('User not found');
        }

        user = await this.userService.create({
          id: authUser.uid,
          nickname: authUser.displayName ?? 'New User',
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          image: authUser.photoURL,
        });
      }

      req['user'] = user;

      const store: SecurityContext = { user: user };

      this.als.run(store, () => next());
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [
      undefined,
      undefined,
    ];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const accessToken = request.cookies['access_token'];
    return accessToken;
  }
}
