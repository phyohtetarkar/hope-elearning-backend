import { ApiOkResponsePaginated, Roles, Staff } from '@/common/decorators';
import {
  CategoryCreateDto,
  CategoryDto,
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
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Course')
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

  @Staff()
  @ApiOkResponsePaginated(CategoryDto)
  @Get()
  async find(@Query() query: CategoryQueryDto) {
    return await this.categoryService.find(query);
  }

  @Get(':id')
  async getCategory(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const result = await this.categoryService.findById(id);
    if (!result) {
      resp.status(HttpStatus.NO_CONTENT);
    }

    return result;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
  }
}
