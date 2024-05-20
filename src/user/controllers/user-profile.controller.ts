import { ApiOkResponsePaginated } from '@/common/decorators';
import {
  CourseDto,
  EnrolledCourseDto,
  QueryDto,
  UserDto,
  UserMetaDto,
  UserUpdateDto,
} from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_BOOKMARK_SERVICE,
  COURSE_ENROLLMENT_SERVICE,
  COURSE_REVIEW_SERVICE,
  CourseBookmarkService,
  CourseEnrollmentService,
  CourseReviewService,
  USER_SERVICE,
  UserService,
} from '@/core/services';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Query,
  Req,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Profile')
@Controller('profile')
export class UserProfileController {
  constructor(
    private security: SecurityContextService,
    @Inject(USER_SERVICE)
    private userService: UserService,
    @Inject(COURSE_REVIEW_SERVICE)
    private courseReviewService: CourseReviewService,
    @Inject(COURSE_ENROLLMENT_SERVICE)
    private courseEnrollmentService: CourseEnrollmentService,
    @Inject(COURSE_BOOKMARK_SERVICE)
    private courseBookmarkService: CourseBookmarkService,
  ) {}

  @SerializeOptions({
    groups: ['detail'],
  })
  @Get()
  getUser(@Req() request: Request) {
    return request['user'] as UserDto;
  }

  @Put()
  async update(@Body() values: UserUpdateDto) {
    const user = this.security.getAuthenticatedUser();
    await this.userService.update({
      ...values,
      id: user.id,
    });
  }

  @Get('meta')
  async getUserMeta() {
    const user = this.security.getAuthenticatedUser();
    const enrollmentCount = await this.courseEnrollmentService.countByUser(
      user.id,
    );
    const bookmarkCount = await this.courseBookmarkService.countByUser(user.id);

    return new UserMetaDto({
      enrollmentCount,
      bookmarkCount,
    });
  }

  @ApiOkResponsePaginated(EnrolledCourseDto)
  @Get('enrollments')
  async getEnrollments(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseEnrollmentService.findByUserId(user.id, query);
  }

  @ApiOkResponsePaginated(CourseDto)
  @Get('bookmarks')
  async getBookmarks(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.findByUserId(user.id, query);
  }

  @Get('reviews/:courseId/me')
  async getCourseReviewByUser(
    @Param('courseId') courseId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.courseReviewService.findByUserIdAndCourseId(
      user.id,
      courseId,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
