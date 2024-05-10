import { CourseMetaEntity } from '@/core/entities/course-meta.entity';
import { CourseReviewEntity } from '@/core/entities/course-review.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { COURSE_REVIEW_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './controllers/review.controller';
import { TypeormCourseReviewService } from './services/typeorm-course-review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseReviewEntity,
      CourseMetaEntity,
    ]),
  ],
  providers: [
    {
      provide: COURSE_REVIEW_SERVICE,
      useClass: TypeormCourseReviewService,
    },
  ],
  controllers: [ReviewController],
  exports: [COURSE_REVIEW_SERVICE],
})
export class ReviewModule {}
