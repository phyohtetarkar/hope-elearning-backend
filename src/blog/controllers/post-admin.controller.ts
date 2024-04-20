import { Staff } from '@/common/decorators';
import { PostCreateDto, PostQueryDto, PostUpdateDto } from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostCreateTransformPipe } from '../pipes/post-create-transform.pipe';
import { PostUpdateTransformPipe } from '../pipes/post-update-transform.pipe';
import { PostOwnerGuard } from '../guards/post-owner.guard';
import { PostQueryTransformPipe } from '../pipes/post-query-transform.pipe';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('/admin/posts')
@Staff()
export class PostAdminController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Post()
  async create(@Body(PostCreateTransformPipe) values: PostCreateDto) {
    return await this.postService.create(values);
  }

  @Put()
  async update(@Body(PostUpdateTransformPipe) values: PostUpdateDto) {
    return await this.postService.update(values);
  }

  @Get()
  async find(@Query(PostQueryTransformPipe) query: PostQueryDto) {
    return await this.postService.find(query);
  }

  @UseGuards(PostOwnerGuard)
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findById(id);
  }

  @UseGuards(PostOwnerGuard)
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    await this.postService.delete(id);
  }
}
