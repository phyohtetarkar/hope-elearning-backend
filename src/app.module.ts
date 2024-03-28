import { AuthenticationModule } from '@/features/authentication/authentication.module';
import { UserModule } from '@/features/user/user.module';
import { PersistenceModule } from '@/persistence/persistence.module';
import { SecurityModule } from '@/security';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common';
import { BlogModule } from './features/blog/blog.module';

@Module({
  imports: [
    CommonModule,
    PersistenceModule,
    UserModule,
    SecurityModule,
    AuthenticationModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
