import { LessonStatus } from '@/core/models';
import { LESSON_SERVICE, LessonService } from '@/core/services';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/content/lessons')
export class LessonController {
  constructor(@Inject(LESSON_SERVICE) private lessonService: LessonService) {}

  @SerializeOptions({
    groups: ['lesson-detail'],
  })
  @Get(':slug/trial')
  async getLesson(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.lessonService.findBySlug(slug);
    if (!result || result.status !== LessonStatus.PUBLISHED || !result.trial) {
      resp.status(HttpStatus.NO_CONTENT);
      return undefined;
    }

    return result;
  }
}
