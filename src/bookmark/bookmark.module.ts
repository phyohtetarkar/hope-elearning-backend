import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { COURSE_BOOKMARK_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCourseBookmarkService } from './services/typeorm-course-bookmark.service';
import { BookmarkController } from './controllers/bookmark.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, BookmarkedCourseEntity])],
  providers: [
    {
      provide: COURSE_BOOKMARK_SERVICE,
      useClass: TypeormCourseBookmarkService,
    },
  ],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
