import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlogModule } from './blog/blog.module';
import { CoreModule } from './core/core.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [CoreModule, UserModule, BlogModule, CourseModule],
  controllers: [AppController],
})
export class AppModule {}
