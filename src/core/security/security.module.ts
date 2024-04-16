import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as cors from 'cors';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { SecurityContextService } from './security-context.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { JwtVerificationService } from './jwt-verification.service';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    SecurityContextService,
    JwtVerificationService,
    FirebaseService,
    CaslAbilityFactory,
  ],
  exports: [SecurityContextService, CaslAbilityFactory],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: [],
          allowedHeaders: '*',
          credentials: true,
        }),
      )
      .forRoutes('*')
      .apply(AuthenticationMiddleware)
      .exclude({ path: '/content/:path*', method: RequestMethod.GET })
      .forRoutes('*');
    // .apply((req: Request, res: Response, next: NextFunction) => {
    //   const store: SecurityContext = {};
    //   this.als.run(store, () => next());
    // })
    // .forRoutes('*');
  }
}
