import { ApiOkResponsePaginated } from '@/common/decorators';
import { EnrolledCourseDto, QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_ENROLLMENT_SERVICE,
  CourseEnrollmentService,
} from '@/core/services';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Enrollment')
@Controller('/enrollments')
export class EnrollmentController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_ENROLLMENT_SERVICE)
    private courseEnrollmentService: CourseEnrollmentService,
  ) {}

  @ApiOkResponsePaginated(EnrolledCourseDto)
  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseEnrollmentService.findByUserId(user.id, query);
  }

  @Post(':courseId/completed/:lessonId')
  async addCompletedLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.insertCompletedLesson({
      userId: user.id,
      courseId: courseId,
      lessonId: lessonId,
    });
  }

  @Delete(':courseId/completed/:lessonId')
  async removeCompletedLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.deleteCompletedLesson({
      userId: user.id,
      courseId: courseId,
      lessonId: lessonId,
    });
  }

  @Put(':courseId/resume/:lessonId')
  async updateResumeLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.updateResumeLesson({
      userId: user.id,
      courseId: courseId,
      lessonId: lessonId,
    });
  }

  @Post(':courseId')
  async enroll(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.enroll(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.remove(user.id, courseId);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':courseSlug/lessons/:lessonSlug')
  async getEnrolledCourseLesson(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.courseEnrollmentService.findEnrolledCourseLesson(
      user.id,
      courseSlug,
      lessonSlug,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }

  @Get(':courseId')
  async getEnrolledCourse(
    @Param('courseId') courseId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.courseEnrollmentService.findByUserIdAndCourseId(
      user.id,
      courseId,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
