import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from '@/persistence/entities/user.entity';
import { USER_SERVICE } from './services/user.service';
import { TypeormUserService } from './services/internal/typeorm-user.service';
import { PROFILE_SERVICE } from './services/profile.service';
import { TypeormProfileService } from './services/internal/typeorm-profile.service';

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
  exports: [USER_SERVICE],
  controllers: [UserController],
})
export class UserModule {}
