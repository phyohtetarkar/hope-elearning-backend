import { ApiOkResponsePaginated } from '@/common/decorators';
import {
  EnrolledCourseDto,
  QueryDto,
  QuizResponseCreateDto,
} from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_ENROLLMENT_SERVICE,
  CourseEnrollmentService,
  QUIZ_RESPONSE_SERVICE,
  QuizResponseService,
} from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Enrollment')
@Controller('/enrollments')
export class EnrollmentController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_ENROLLMENT_SERVICE)
    private courseEnrollmentService: CourseEnrollmentService,
    @Inject(QUIZ_RESPONSE_SERVICE)
    private quizResponseService: QuizResponseService,
  ) {}

  @ApiOkResponsePaginated(EnrolledCourseDto)
  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseEnrollmentService.findByUserId(user.id, query);
  }

  @Post(':courseId/completed/:lessonId')
  async addCompletedLesson(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
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
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
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
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.updateResumeLesson({
      userId: user.id,
      courseId: courseId,
      lessonId: lessonId,
    });
  }

  @Get(':lessonId/quiz-responses')
  async findQuizResponses(@Param('lessonId', ParseIntPipe) lessonId: number) {
    const userId = this.security.getAuthenticatedUser().id;
    return await this.quizResponseService.findByLesson(userId, lessonId);
  }

  @ApiBody({ isArray: true, type: QuizResponseCreateDto })
  @Post(':lessonId/quiz-responses')
  async create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() values: QuizResponseCreateDto[],
  ) {
    const userId = this.security.getAuthenticatedUser().id;
    return await this.quizResponseService.create(userId, lessonId, values);
  }

  @Delete(':lessonId/quiz-responses')
  async delete(@Param('lessonId', ParseIntPipe) lessonId: number) {
    const userId = this.security.getAuthenticatedUser().id;
    await this.quizResponseService.deleteByLesson(userId, lessonId);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':slug/lesson')
  async getEnrolledCourseLesson(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.courseEnrollmentService.findEnrolledCourseLesson(
      user.id,
      slug,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }

  @Post(':courseId')
  async enroll(@Param('courseId', ParseIntPipe) courseId: number) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.enroll(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param('courseId', ParseIntPipe) courseId: number) {
    const user = this.security.getAuthenticatedUser();
    await this.courseEnrollmentService.remove(user.id, courseId);
  }

  @Get(':courseId')
  async getEnrolledCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
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
