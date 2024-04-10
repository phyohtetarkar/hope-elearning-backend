import { AuthenticationModule } from '@/auth/authentication.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlogModule } from './blog/blog.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, UserModule, AuthenticationModule, BlogModule],
  controllers: [AppController],
})
export class AppModule {}
