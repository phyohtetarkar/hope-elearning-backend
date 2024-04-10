import { Staff } from '@/common/decorators';
import { PostCreateDto, PostQueryDto, PostUpdateDto } from '@/core/models';
import { POST_SERVICE, PostService } from '@/core/services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('/admin/posts')
@Staff()
export class PostAdminController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Post()
  async create(@Body() values: PostCreateDto) {
    return await this.postService.create(values);
  }

  @Put()
  async update(@Body() values: PostUpdateDto) {
    return await this.postService.update(values);
  }

  @Get()
  async find(@Query() query: PostQueryDto) {
    return await this.postService.find(query);
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findById(id);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    await this.postService.delete(id);
  }
}
