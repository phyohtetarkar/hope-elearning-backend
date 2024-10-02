import { ApiOkResponsePaginated } from '@/common/decorators';
import { CourseDto, QueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import {
  COURSE_BOOKMARK_SERVICE,
  CourseBookmarkService,
} from '@/core/services';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookmark')
@Controller('/bookmarks')
export class BookmarkController {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_BOOKMARK_SERVICE)
    private courseBookmarkService: CourseBookmarkService,
  ) {}

  @ApiOkResponsePaginated(CourseDto)
  @Get()
  async find(@Query() query: QueryDto) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.findByUserId(user.id, query);
  }

  @Post(':courseId')
  async add(@Param('courseId', ParseIntPipe) courseId: number) {
    const user = this.security.getAuthenticatedUser();
    if (!user.emailVerified) {
      throw new BadRequestException('Email verification required');
    }
    await this.courseBookmarkService.add(user.id, courseId);
  }

  @Delete(':courseId')
  async remove(@Param('courseId', ParseIntPipe) courseId: number) {
    const user = this.security.getAuthenticatedUser();
    await this.courseBookmarkService.remove(user.id, courseId);
  }

  @Get(':courseId/check')
  async checkBookmarkedCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    const user = this.security.getAuthenticatedUser();
    return await this.courseBookmarkService.existsByUserIdAndCourseId(
      user.id,
      courseId,
    );
  }
}
