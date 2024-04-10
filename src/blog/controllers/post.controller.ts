import { PostQueryDto, PostStatus } from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';

@Controller('/content/posts')
export class PostController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Get()
  async find(@Query() query: PostQueryDto) {
    return await this.postService.find({
      ...query,
      status: PostStatus.PUBLISHED,
    });
  }

  @Get(':slug')
  async getPost(@Param('slug') slug: string) {
    return await this.postService.findBySlug(slug);
  }
}
