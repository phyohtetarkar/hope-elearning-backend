import { BookmarkedCourseEntity } from '@/core/entities/bookmarked-course.entity';
import { CategoryEntity } from '@/core/entities/category.entity';
import { ChapterEntity } from '@/core/entities/chapter.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseAuthorEntity } from '@/core/entities/course-author.entity';
import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseReviewEntity } from '@/core/entities/course-review.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonRevisionEntity } from '@/core/entities/lesson-revision.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import {
  CATEGORY_SERVICE,
  CHAPTER_SERVICE,
  COURSE_AUTHOR_SERVICE,
  COURSE_SERVICE,
  LESSON_REVISION_SERVICE,
  LESSON_SERVICE,
} from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAdminController } from './controllers/category-admin.controller';
import { ChapterAdminController } from './controllers/chapter-admin.controller';
import { CourseAdminController } from './controllers/course-admin.controller';
import { CourseController } from './controllers/course.controller';
import { LessonAdminController } from './controllers/lesson-admin.controller';
import { TypeormCategoryService } from './services/typeorm-category.service';
import { TypeormChapterService } from './services/typeorm-chapter.service';
import { TypeormCourseAuthorService } from './services/typeorm-course-author.service';
import { TypeormCourseService } from './services/typeorm-course.service';
import { TypeormLessonRevisionService } from './services/typeorm-lesson-revision.service';
import { TypeormLessonService } from './services/typeorm-lesson.service';
import { CategoryController } from './controllers/category.controller';
import { LessonController } from './controllers/lesson.controller';

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
      provide: COURSE_SERVICE,
      useClass: TypeormCourseService,
    },
    {
      provide: COURSE_AUTHOR_SERVICE,
      useClass: TypeormCourseAuthorService,
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
  controllers: [
    CategoryAdminController,
    CategoryController,
    CourseAdminController,
    CourseController,
    ChapterAdminController,
    LessonAdminController,
    LessonController,
  ],
})
export class CourseModule {}
