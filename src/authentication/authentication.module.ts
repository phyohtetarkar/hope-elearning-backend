import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationGuard, FirebaseModule } from './firebase';
import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [
    UserModule,
    FirebaseModule.registerAsync({
      imports: [UserModule],
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
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
