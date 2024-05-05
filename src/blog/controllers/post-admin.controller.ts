import { Staff } from '@/common/decorators';
import {
  PostCreateDto,
  PostQueryDto,
  PostStatus,
  PostUpdateDto,
} from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
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
  Query,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PostOwnerGuard } from '../guards/post-owner.guard';
import { PostCreateTransformPipe } from '../pipes/post-create-transform.pipe';
import { PostQueryTransformPipe } from '../pipes/post-query-transform.pipe';
import { PostUpdateTransformPipe } from '../pipes/post-update-transform.pipe';

@Controller('/admin/posts')
@Staff()
export class PostAdminController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Post()
  async create(@Body(PostCreateTransformPipe) values: PostCreateDto) {
    return await this.postService.create(values);
  }

  @SerializeOptions({
    groups: ['detail'],
  })
  @UseGuards(PostOwnerGuard)
  @Put()
  async update(@Body(PostUpdateTransformPipe) values: PostUpdateDto) {
    return await this.postService.update(values);
  }

  @Get()
  async find(@Query(PostQueryTransformPipe) query: PostQueryDto) {
    return await this.postService.find(query);
  }

  @SerializeOptions({
    groups: ['detail'],
  })
  @UseGuards(PostOwnerGuard)
  @Get(':id')
  async getPost(
    @Param('id') id: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.postService.findById(id);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }

  @UseGuards(PostOwnerGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.delete(id);
  }
}
