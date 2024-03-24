import { UserEntity } from '@/user/models/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUserService } from './services/internal/typeorm-user.service';
import { USER_SERVICE } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: TypeormUserService,
    },
  ],
  exports: [USER_SERVICE],
  controllers: [UserController],
})
export class UserModule {}
