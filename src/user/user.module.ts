import { UserEntity } from '@/core/entities/user.entity';
import { PROFILE_SERVICE, USER_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormProfileService } from './services/typeorm-profile.service';
import { TypeormUserService } from './services/typeorm-user.service';
import { UserAdminController } from './user-admin.controller';
import { UserProfileController } from './user-profile.controller';
import { ReviewModule } from '@/review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ReviewModule],
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
  controllers: [UserAdminController, UserProfileController],
  exports: [USER_SERVICE],
})
export class UserModule {}
