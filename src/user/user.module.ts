import { UserEntity } from '@/core/entities/user.entity';
import { PROFILE_SERVICE, USER_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormProfileService } from './services/typeorm-profile.service';
import { TypeormUserService } from './services/typeorm-user.service';
import { UserAdminController } from './controllers/user-admin.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { ReviewModule } from '@/review/review.module';
import { BookmarkModule } from '@/bookmark/bookmark.module';
import { EnrollmentModule } from '@/enrollment/enrollment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ReviewModule,
    BookmarkModule,
    EnrollmentModule,
  ],
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
