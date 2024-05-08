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

@Controller('/admin/chapters')
@Staff()
export class ChapterAdminController {
  constructor(
    @Inject(CHAPTER_SERVICE) private chapterService: ChapterService,
  ) {}

  @UseGuards(CourseOwnerGuard)
  @Post()
  async create(@Body() values: ChapterCreateDto) {
    return await this.chapterService.create(values);
  }

  @UseGuards(CourseOwnerGuard)
  @Put()
  async update(@Body() values: ChapterUpdateDto) {
    await this.chapterService.update(values);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    await this.chapterService.delete(id);
  }
}
