import { QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  BOOKMARK_COURSE_SERVICE,
  BookmarkCourseService,
} from '@/core/services';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/bookmarks')
export class BookmarkController {
  constructor(
    private security: SecurityContextService,
    @Inject(BOOKMARK_COURSE_SERVICE)
    private bookmarkCourseService: BookmarkCourseService,
  ) {}

  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.bookmarkCourseService.findByUserId(user.id, query);
  }

  @Post(':courseId')
  async add(@Param() courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.bookmarkCourseService.add(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param() courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.bookmarkCourseService.remove(user.id, courseId);
  }

  @Get(':courseId')
  async getBookmarkedCourse(
    @Param('courseId') courseId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const user = this.security.getAuthenticatedUser();
    const result = await this.bookmarkCourseService.findByUserIdAndCourseId(
      user.id,
      courseId,
    );

    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
