import { QueryDto, UserDto, UserUpdateDto } from '@/core/models';
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
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from '@/core/storage/file-storage.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';

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
    @Inject(FILE_STORAGE_SERVICE)
    private fileStorageService: FileStorageService,
  ) {}

  @SerializeOptions({
    groups: ['detail'],
  })
  @Get()
  getUser(@Req() request: Request) {
    return request['user'] as UserDto;
  }

  @Post()
  async update(@Body() values: UserUpdateDto) {
    const user = this.security.getAuthenticatedUser();
    await this.userService.update({
      ...values,
      id: user.id,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @Put('image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(@UploadedFile() file: Express.Multer.File) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.fileStorageService.writeFile(file);

    if (!result) {
      throw new BadRequestException('Required upload file');
    }

    await this.userService.updateImage(user.id, result.url);
  }

  @Get('enrollments')
  async getEnrollments(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseEnrollmentService.findByUserId(user.id, query);
  }

  @Get('enrollment-count')
  async getEnrollmentCount() {
    const user = this.security.getAuthenticatedUser();
    return await this.courseEnrollmentService.countByUser(user.id);
  }

  @Get('bookmarks')
  async getBookmarks(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.findByUserId(user.id, query);
  }

  @Get('bookmark-count')
  async getBookmarkCount() {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.countByUser(user.id);
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
