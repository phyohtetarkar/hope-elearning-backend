import { PostQueryDto, PostStatus } from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  Res,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/content/posts')
export class PostController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Get()
  async find(@Query() query: PostQueryDto) {
    return await this.postService.find({
      ...query,
      status: PostStatus.PUBLISHED,
      orderBy: 'publishedAt',
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
    const result = await this.postService.findBySlug(slug);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }
}
