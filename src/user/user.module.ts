import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from '@/core/entities/user.entity';
import { TypeormUserService } from './services/typeorm-user.service';
import { TypeormProfileService } from './services/typeorm-profile.service';
import { PROFILE_SERVICE, USER_SERVICE } from '@/core/services';
import { UserProfileController } from './user-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: TypeormUserService,
    },
    {
      provide: PROFILE_SERVICE,
      useClass: TypeormProfileService,
    },
  ],
  controllers: [UserController, UserProfileController],
})
export class UserModule {}
