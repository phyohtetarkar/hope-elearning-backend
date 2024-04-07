import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { TAG_SERVICE, TagService } from './services/tag.service';
import { TagQuery } from './models/tag.query';

@Controller('/content/tags')
export class TagController {
  constructor(@Inject(TAG_SERVICE) private tagService: TagService) {}

  @Get()
  async find(@Query() query: TagQuery) {
    return await this.tagService.find(query);
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return await this.tagService.findBySlug(slug);
  }
}
