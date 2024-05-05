import { Staff } from '@/common/decorators';
import { LessonCreateDto, LessonUpdateDto, SortUpdateDto } from '@/core/models';
import { LESSON_SERVICE, LessonService } from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CourseOwnerGuard } from '../guards/course-owner.guard';

@Controller('/admin/courses/:id')
@UseGuards(CourseOwnerGuard)
@Staff()
export class LessonAdminController {
  constructor(@Inject(LESSON_SERVICE) private lessonService: LessonService) {}

  @Post('lessons')
  async create(@Body() values: LessonCreateDto) {
    return await this.lessonService.create(values);
  }

  @Put('lessons')
  async update(@Body() values: LessonUpdateDto) {
    return await this.lessonService.update(values);
  }

  @Put('sort-lessons')
  async sort(@Body() values: [SortUpdateDto]) {
    return await this.lessonService.updateSort(values);
  }

  @Delete('lessons/:lessonId')
  async deleteCourse(@Param('lessonId') id: string) {
    await this.lessonService.delete(id);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get('lessons/:lessonId')
  async getCourse(
    @Param('lessonId') id: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.lessonService.findById(id);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
