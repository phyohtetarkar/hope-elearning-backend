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
import { LessonUpdateTransformPipe } from '../pipes/lesson-update-transform.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Course')
@Controller('/admin/courses/:courseId/lessons')
@UseGuards(CourseOwnerGuard)
@Staff()
export class LessonAdminController {
  constructor(@Inject(LESSON_SERVICE) private lessonService: LessonService) {}

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() values: LessonCreateDto,
  ) {
    return await this.lessonService.create({
      ...values,
      courseId: courseId,
    });
  }

  @Put()
  async update(
    @Param('courseId') courseId: string,
    @Body(LessonUpdateTransformPipe) values: LessonUpdateDto,
  ) {
    await this.lessonService.update({
      ...values,
      courseId: courseId,
    });
  }

  @Delete(':lessonId')
  async delete(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    await this.lessonService.delete(courseId, lessonId);
  }

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':lessonId')
  async getCourse(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.lessonService.findById(lessonId);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }
}
