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
  ParseIntPipe,
  Post,
  Put,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CourseOwnerGuard } from '../guards/course-owner.guard';
import { LessonUpdateTransformPipe } from '../pipes/lesson-update-transform.pipe';

@ApiTags('Course')
@Controller('/admin/courses/:courseId/lessons')
@UseGuards(CourseOwnerGuard)
@Staff()
export class LessonAdminController {
  constructor(@Inject(LESSON_SERVICE) private lessonService: LessonService) {}

  @Post()
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() values: LessonCreateDto,
  ) {
    return await this.lessonService.create({
      ...values,
      courseId: courseId,
    });
  }

  @Put()
  async update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body(LessonUpdateTransformPipe) values: LessonUpdateDto,
  ) {
    return await this.lessonService.update({
      ...values,
      courseId: courseId,
    });
  }

  @Delete(':lessonId')
  async delete(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    await this.lessonService.delete(courseId, lessonId);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':lessonId')
  async getCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.lessonService.findById(lessonId);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
