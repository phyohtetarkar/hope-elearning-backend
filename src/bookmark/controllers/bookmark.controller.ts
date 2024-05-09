import { QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_BOOKMARK_SERVICE,
  CourseBookmarkService,
} from '@/core/services';
import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller('/bookmarks')
export class BookmarkController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_BOOKMARK_SERVICE)
    private courseBookmarkService: CourseBookmarkService,
  ) {}

  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.findByUserId(user.id, query);
  }

  @Post(':courseId')
  async add(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.courseBookmarkService.add(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    await this.courseBookmarkService.remove(user.id, courseId);
  }

  @Get(':courseId/check')
  async checkBookmarkedCourse(@Param('courseId') courseId: string) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.existsByUserIdAndCourseId(
      user.id,
      courseId,
    );
  }
}
