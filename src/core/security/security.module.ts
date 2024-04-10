import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cors from 'cors';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { SecurityContextProvider } from './security-context.provider';
import { FirebaseService, JwtVerificationService } from '../services';
import { CaslAbilityFactory } from './casl-ability.factory';

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
    SecurityContextProvider,
    JwtVerificationService,
    FirebaseService,
    CaslAbilityFactory,
  ],
  exports: [SecurityContextProvider, CaslAbilityFactory],
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
      .forRoutes('*');
    // .apply((req: Request, res: Response, next: NextFunction) => {
    //   const store: SecurityContext = {};
    //   this.als.run(store, () => next());
    // })
    // .forRoutes('*');
  }
}
