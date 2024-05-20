import { Staff } from '@/common/decorators';
import { ChapterCreateDto, ChapterUpdateDto } from '@/core/models';
import { CHAPTER_SERVICE, ChapterService } from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseOwnerGuard } from '../guards/course-owner.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Course')
@Controller('/admin/courses/:courseId/chapters')
@UseGuards(CourseOwnerGuard)
@Staff()
export class ChapterAdminController {
  constructor(
    @Inject(CHAPTER_SERVICE) private chapterService: ChapterService,
  ) {}

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() values: ChapterCreateDto,
  ) {
    return await this.chapterService.create({
      ...values,
      courseId: courseId,
    });
  }

  @Put()
  async update(
    @Param('courseId') courseId: string,
    @Body() values: ChapterUpdateDto,
  ) {
    await this.chapterService.update({
      ...values,
      courseId: courseId,
    });
  }

  @Delete(':chapterId')
  async delete(
    @Param('courseId') courseId: string,
    @Param('chapterId') chapterId: string,
  ) {
    await this.chapterService.delete(courseId, chapterId);
  }
}
