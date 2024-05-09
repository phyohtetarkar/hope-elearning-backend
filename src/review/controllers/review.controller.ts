import { CourseReviewUpdateDto, QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { COURSE_REVIEW_SERVICE, CourseReviewService } from '@/core/services';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/content/courses/:courseId/reviews')
export class ReviewController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_REVIEW_SERVICE)
    private courseReviewService: CourseReviewService,
  ) {}

  @Post()
  async writeReview(
    @Param('courseId') courseId: string,
    @Body() values: CourseReviewUpdateDto,
  ) {
    const user = this.security.getAuthenticatedUser();
    await this.courseReviewService.save({
      ...values,
      userId: user.id,
      courseId: courseId,
    });
  }

  @Get()
  async getCourseReviews(
    @Param('courseId') courseId: string,
    @Query() query: QueryDto,
  ) {
    return await this.courseReviewService.findByCourseId(courseId, query);
  }

  @Get(':userId')
  async getCourseReviewByUser(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.courseReviewService.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
