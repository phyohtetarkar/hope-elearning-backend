import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AlsModule } from './als/als.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigService } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import { AuthenticationGuard, AuthorizationGuard, SecurityContext } from '.';
import { NextFunction } from 'express';
import { UserModule } from '@/features/user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AlsModule,
    UserModule,
    FirebaseModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        serviceAccount: configService.get<string>('FIREBASE_SERVICE_ACCOUNT'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  exports: [FirebaseModule],
})
export class SecurityModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<SecurityContext>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        const store: SecurityContext = {};
        this.als.run(store, () => next());
      })
      .forRoutes('*');
  }
}
