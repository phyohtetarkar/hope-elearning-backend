import { Staff } from '@/common/decorators';
import { LessonCreateDto, LessonUpdateDto } from '@/core/models';
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

@Controller('/admin/lessons')
@Staff()
export class LessonAdminController {
  constructor(@Inject(LESSON_SERVICE) private lessonService: LessonService) {}

  @UseGuards(CourseOwnerGuard)
  @Post()
  async create(@Body() values: LessonCreateDto) {
    return await this.lessonService.create(values);
  }

  @UseGuards(CourseOwnerGuard)
  @Put()
  async update(@Body() values: LessonUpdateDto) {
    await this.lessonService.update(values);
  }

  @Delete(':id')
  async deleteCourse(@Param('lessonId') id: string) {
    await this.lessonService.delete(id);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':id')
  async getCourse(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.lessonService.findById(id);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
