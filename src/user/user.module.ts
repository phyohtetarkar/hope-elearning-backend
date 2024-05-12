import { BookmarkModule } from '@/bookmark/bookmark.module';
import { UserEntity } from '@/core/entities/user.entity';
import { USER_SERVICE } from '@/core/services';
import { EnrollmentModule } from '@/enrollment/enrollment.module';
import { ReviewModule } from '@/review/review.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAdminController } from './controllers/user-admin.controller';
import { UserProfileController } from './controllers/user-profile.controller';
import { TypeormUserService } from './services/typeorm-user.service';

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
  ],
  controllers: [UserAdminController, UserProfileController],
  exports: [USER_SERVICE],
})
export class UserModule {}
