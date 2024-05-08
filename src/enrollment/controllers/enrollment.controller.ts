import { QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ENROLL_COURSE_SERVICE, EnrollCourseService } from '@/core/services';
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
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/enrollments')
export class EnrollmentController {
  constructor(
    private security: SecurityContextService,
    @Inject(ENROLL_COURSE_SERVICE)
    private enrollCourseService: EnrollCourseService,
  ) {}

  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.enrollCourseService.findByUserId(user.id, query);
  }

  @Post(':courseId/completed/:lessonId')
  async addCompletedLesson(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.enrollCourseService.insertCompletedLesson({
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
    await this.enrollCourseService.updateResumeLesson({
      userId: user.id,
      courseId: courseId,
      lessonId: lessonId,
    });
  }

  @Post(':courseId')
  async enroll(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.enrollCourseService.enroll(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.enrollCourseService.remove(user.id, courseId);
  }

  @Get(':courseId')
  async getEnrolledCourse(
    @Param('courseId') courseId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.enrollCourseService.findByUserIdAndCourseId(
      user.id,
      courseId,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
