import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AUTHENTICATION_SERVICE } from './services/authentication.service';
import { EXTERNAL_AUTH_SERVICE } from './services/external-auth.service';
import { FirebaseAuthService } from './services/internal/firebase-auth.service';
import { TypeormAuthenticationService } from './services/internal/typeorm-authentication.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: EXTERNAL_AUTH_SERVICE,
      useClass: FirebaseAuthService,
    },
    {
      provide: AUTHENTICATION_SERVICE,
      useClass: TypeormAuthenticationService,
    },
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
