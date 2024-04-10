import { TagQueryDto } from '@/core/models';
import { TAG_SERVICE, TagService } from '@/core/services';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

@Controller('/content/tags')
export class TagController {
  constructor(@Inject(TAG_SERVICE) private tagService: TagService) {}

  @Get()
  async find(@Query() query: TagQueryDto) {
    return await this.tagService.find(query);
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return await this.tagService.findBySlug(slug);
  }
}
