import { TagQueryDto } from '@/core/models';
import { TAG_SERVICE, TagService } from '@/core/services';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/content/tags')
export class TagController {
  constructor(@Inject(TAG_SERVICE) private tagService: TagService) {}

  @Get()
  async find(@Query() query: TagQueryDto) {
    return await this.tagService.find(query);
  }

  @Get(':slug')
  async getPostBySlug(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.tagService.findBySlug(slug);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }
}
