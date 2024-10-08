import { UserModule } from '@/user/user.module';
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AsyncLocalStorage } from 'async_hooks';
import * as cors from 'cors';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';
import { FirebaseService } from './firebase.service';
import { JwtVerificationService } from './jwt-verification.service';
import { SecurityContextService } from './security-context.service';

@Global()
@Module({
  imports: [UserModule],
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
  ],
  exports: [SecurityContextService, FirebaseService],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: ['http://localhost:3000'],
          allowedHeaders: '*',
          credentials: true,
        }),
      )
      .forRoutes('*')
      .apply(AuthenticationMiddleware)
      .exclude({ path: '/content/:path*', method: RequestMethod.GET })
      .exclude({ path: '/auth/verify-email', method: RequestMethod.POST })
      .exclude({ path: '/auth/refresh', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
