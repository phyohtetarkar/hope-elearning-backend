import { UserModule } from '@/user/user.module';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { BlogModule } from './blog/blog.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CoreModule } from './core/core.module';
import { CourseModule } from './course/course.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ReviewModule } from './review/review.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';

function logger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  console.log(method, originalUrl);
  next();
}

@Module({
  imports: [
    CoreModule,
    UserModule,
    BlogModule,
    CourseModule,
    DashboardModule,
    EnrollmentModule,
    BookmarkModule,
    ReviewModule,
    SettingModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(logger).forRoutes('*');
  }
}
