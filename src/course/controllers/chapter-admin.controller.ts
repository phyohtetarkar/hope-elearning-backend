import { Staff } from '@/common/decorators';
import {
  ChapterCreateDto,
  ChapterUpdateDto,
  SortUpdateDto,
} from '@/core/models';
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

@Controller('/admin/courses/:id')
@UseGuards(CourseOwnerGuard)
@Staff()
export class ChapterAdminController {
  constructor(
    @Inject(CHAPTER_SERVICE) private chapterService: ChapterService,
  ) {}

  @Post('chapters')
  async create(@Body() values: ChapterCreateDto) {
    return await this.chapterService.create(values);
  }

  @Put('chapters')
  async update(@Body() values: ChapterUpdateDto) {
    await this.chapterService.update(values);
  }

  @Put('sort-chapters')
  async sort(@Body() values: [SortUpdateDto]) {
    await this.chapterService.updateSort(values);
  }

  @Delete('chapters/:chapterId')
  async deleteCourse(@Param('chapterId') id: string) {
    await this.chapterService.delete(id);
  }
}
