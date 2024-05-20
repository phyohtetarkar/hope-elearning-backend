import { ApiOkResponsePaginated } from '@/common/decorators';
import { PostDto, PostQueryDto, PostStatus } from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Blog')
@Controller('/content/posts')
export class PostController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @ApiOkResponsePaginated(PostDto)
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
    if (!result || result.status !== PostStatus.PUBLISHED) {
      resp.status(HttpStatus.NO_CONTENT);
      return undefined;
    }
    return result;
  }
}
