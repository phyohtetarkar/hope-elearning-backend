import { CourseQueryDto, CourseStatus } from '@/core/models';
import { COURSE_SERVICE, CourseService } from '@/core/services';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/content/courses')
export class CourseController {
  constructor(@Inject(COURSE_SERVICE) private courseService: CourseService) {}

  @Get()
  async find(@Query() query: CourseQueryDto) {
    return await this.courseService.find({
      ...query,
      status: CourseStatus.PUBLISHED,
    });
  }

  @SerializeOptions({
    groups: ['detail'],
  })
  @Get(':slug')
  async getPost(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.courseService.findBySlug(slug);
    if (!result || result.status !== CourseStatus.PUBLISHED) {
      resp.status(HttpStatus.NO_CONTENT);
      return undefined;
    }
    return result;
  }
}
