import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { SecurityContext } from '../security/security-context.domain';
import { FirebaseService, JwtVerificationService } from '../services';

@Injectable()
export class AuthenticationMiddleware
  implements NestMiddleware<Request, Response>
{
  constructor(
    private als: AsyncLocalStorage<SecurityContext>,
    private jwtVerificationService: JwtVerificationService,
    private firebaseServce: FirebaseService,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extractTokenFromCookie(req);

      if (!token) {
        throw new Error('Access token not found');
      }

      const { sub } = await this.jwtVerificationService.verify(token);

      if (!sub) {
        throw new Error('User not found');
      }

      let user = await this.userRepo.findOneBy({ id: sub });

      if (!user) {
        // first time user sync
        const authUser = await this.firebaseServce.getUser(sub);

        if (!authUser) {
          throw new Error('User not found');
        }

        user = await this.userRepo.save({
          id: authUser.uid,
          fullName: authUser.displayName ?? 'User',
          email: authUser.email,
          phone: authUser.phoneNumber,
        });
      }

      req['user'] = user.toDto();

      const store: SecurityContext = { user: user.toDto() };

      this.als.run(store, () => next());
    } catch (e) {
      throw new UnauthorizedException(e);
    }
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
