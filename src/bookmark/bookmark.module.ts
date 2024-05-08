import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { BOOKMARK_COURSE_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormBookmarkCourseService } from './services/typeorm-bookmark-course.service';
import { BookmarkController } from './controllers/bookmark.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, BookmarkedCourseEntity])],
  providers: [
    {
      provide: BOOKMARK_COURSE_SERVICE,
      useClass: TypeormBookmarkCourseService,
    },
  ],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
