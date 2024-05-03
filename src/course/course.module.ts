import { CategoryEntity } from '@/core/entities/category.entity';
import {
  CATEGORY_SERVICE,
  CHAPTER_SERVICE,
  LESSON_REVISION_SERVICE,
  LESSON_SERVICE,
} from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAdminController } from './controllers/category-admin.controller';
import { TypeormCategoryService } from './services/typeorm-category.service';
import { CourseEntity } from '@/core/entities/course.entity';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseReviewEntity } from '@/core/entities/course-review.entity';
import { CourseAuthorEntity } from '@/core/entities/course-author.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { TypeormChapterService } from './services/typeorm-chapter.service';
import { TypeormLessonService } from './services/typeorm-lesson.service';
import { TypeormLessonRevisionService } from './services/typeorm-lesson-revision.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      CourseEntity,
      CourseMetaEntity,
      CourseReviewEntity,
      CourseAuthorEntity,
      ChapterEntity,
      LessonEntity,
      LessonRevisionEntity,
      EnrolledCourseEntity,
      CompletedLessonEntity,
      BookmarkedCourseEntity,
    ]),
  ],
  providers: [
    {
      provide: CATEGORY_SERVICE,
      useClass: TypeormCategoryService,
    },
    {
      provide: CHAPTER_SERVICE,
      useClass: TypeormChapterService,
    },
    {
      provide: LESSON_SERVICE,
      useClass: TypeormLessonService,
    },
    {
      provide: LESSON_REVISION_SERVICE,
      useClass: TypeormLessonRevisionService,
    },
  ],
  controllers: [CategoryAdminController],
})
export class CourseModule {}
