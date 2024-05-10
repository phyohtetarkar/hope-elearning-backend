import { UserDto, UserUpdateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_REVIEW_SERVICE,
  CourseReviewService,
  USER_SERVICE,
  UserService,
} from '@/core/services';
import {
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from '@/core/storage/file-storage.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('profile')
export class UserProfileController {
  constructor(
    private security: SecurityContextService,
    @Inject(USER_SERVICE)
    private userService: UserService,
    @Inject(COURSE_REVIEW_SERVICE)
    private courseReviewService: CourseReviewService,
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

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(@UploadedFile() file: Express.Multer.File) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.fileStorageService.writeFile(file);

    await this.userService.updateImage(user.id, result.url);
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
