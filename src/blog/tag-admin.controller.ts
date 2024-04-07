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
import { TAG_SERVICE, TagService } from './services/tag.service';
import { TagUpdateInput } from './models/tag-update.input';
import { TagQuery } from './models/tag.query';

@Controller('/admin/tags')
export class TagAdminController {
  constructor(@Inject(TAG_SERVICE) private tagService: TagService) {}

  @Post()
  async create(@Body() values: TagUpdateInput) {
    return await this.tagService.create(values);
  }

  @Put()
  async update(@Body() values: TagUpdateInput) {
    return await this.tagService.update(values);
  }

  @Get()
  async find(@Query() query: TagQuery) {
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
