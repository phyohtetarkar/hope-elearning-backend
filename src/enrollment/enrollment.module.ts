import { CompletedLessonEntity } from '@/core/entities/completed-lesson.entity';
import { CourseEntity } from '@/core/entities/course.entity';
import { EnrolledCourseEntity } from '@/core/entities/enrolled-course.entity';
import { LessonEntity } from '@/core/entities/lesson.entity';
import { QuizResponseEntity } from '@/core/entities/quiz-response.entity';
import {
  COURSE_ENROLLMENT_SERVICE,
  QUIZ_RESPONSE_SERVICE,
} from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentController } from './controllers/enrollment.controller';
import { TypeormCourseEnrollmentService } from './services/typeorm-course-enrollment.service';
import { TypeormQuizResponseService } from './services/typeorm-quiz-response.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      LessonEntity,
      EnrolledCourseEntity,
      CompletedLessonEntity,
      QuizResponseEntity,
    ]),
  ],
  providers: [
    {
      provide: COURSE_ENROLLMENT_SERVICE,
      useClass: TypeormCourseEnrollmentService,
    },
    {
      provide: QUIZ_RESPONSE_SERVICE,
      useClass: TypeormQuizResponseService,
    },
  ],
  controllers: [EnrollmentController],
  exports: [COURSE_ENROLLMENT_SERVICE],
})
export class EnrollmentModule {}
