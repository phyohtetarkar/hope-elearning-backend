import { ENROLL_COURSE_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeormEnrollCourseService } from './services/typeorm-enroll-course.service';
import { EnrollmentController } from './controllers/enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from '@/core/entities/course.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      LessonEntity,
      EnrolledCourseEntity,
      CompletedLessonEntity,
    ]),
  ],
  providers: [
    {
      provide: ENROLL_COURSE_SERVICE,
      useClass: TypeormEnrollCourseService,
    },
  ],
  controllers: [EnrollmentController],
})
export class EnrollmentModule {}
