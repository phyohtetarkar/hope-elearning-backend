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
import { POST_SERVICE, PostService } from './services/post.service';
import { PostUpdateInput } from './models/post-update.input';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '../user/models/user-role.enum';
import { PostQuery } from './models/post.query';

@Controller('/admin/posts')
@Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.AUTHOR, UserRole.CONTRIBUTOR)
export class PostAdminController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  @Post()
  async create(@Body() values: PostUpdateInput) {
    return await this.postService.create(values);
  }

  @Put()
  async update(@Body() values: PostUpdateInput) {
    return await this.postService.update(values);
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.findById(id);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    await this.postService.delete(id);
  }

  @Get()
  async find(@Query() query: PostQuery) {
    return await this.postService.find(query);
  }
}
