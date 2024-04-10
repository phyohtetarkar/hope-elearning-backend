import { Roles } from '@/common/decorators';
import { TagQueryDto, TagUpdateDto, UserRole } from '@/core/models';
import { TAG_SERVICE, TagService } from '@/core/services';
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

@Controller('/admin/tags')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class TagAdminController {
  constructor(@Inject(TAG_SERVICE) private tagService: TagService) {}

  @Post()
  async create(@Body() values: TagUpdateDto) {
    return await this.tagService.create(values);
  }

  @Put()
  async update(@Body() values: TagUpdateDto) {
    return await this.tagService.update(values);
  }

  @Get()
  async find(@Query() query: TagQueryDto) {
    return await this.tagService.find(query);
  }

  @Get(':id')
  async getTag(@Param('id', ParseIntPipe) id: number) {
    return await this.tagService.findById(id);
  }

  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number) {
    await this.tagService.delete(id);
  }
}
