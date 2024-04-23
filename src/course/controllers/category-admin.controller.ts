import { Roles } from '@/common/decorators';
import {
  CategoryCreateDto,
  CategoryQueryDto,
  CategoryUpdateDto,
  UserRole,
} from '@/core/models';
import { CATEGORY_SERVICE, CategorySerive } from '@/core/services';
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

@Controller('/admin/categories')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class CategoryAdminController {
  constructor(
    @Inject(CATEGORY_SERVICE) private categoryService: CategorySerive,
  ) {}

  @Post()
  async create(@Body() values: CategoryCreateDto) {
    return await this.categoryService.create(values);
  }

  @Put()
  async update(@Body() values: CategoryUpdateDto) {
    return await this.categoryService.update(values);
  }

  @Get()
  async find(@Query() query: CategoryQueryDto) {
    return await this.categoryService.find(query);
  }

  @Get(':id')
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findById(id);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
  }
}
