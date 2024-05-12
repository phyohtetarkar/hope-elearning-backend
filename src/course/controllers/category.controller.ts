import { CategoryQueryDto } from '@/core/models';
import { CATEGORY_SERVICE, CategorySerive } from '@/core/services';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('/content/categories')
export class CategoryController {
  constructor(
    @Inject(CATEGORY_SERVICE) private categoryService: CategorySerive,
  ) {}

  @Get()
  async find(@Query() query: CategoryQueryDto) {
    return await this.categoryService.find({
      ...query,
      published: true,
    });
  }

  @Get(':slug')
  async getCourseBySlug(
    @Param('slug') slug: string,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.categoryService.findBySlug(slug);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }
    return result;
  }
}