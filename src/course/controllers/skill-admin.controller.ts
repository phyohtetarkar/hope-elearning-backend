import { Roles } from '@/common/decorators';
import {
  SkillCreateDto,
  SkillQueryDto,
  SkillUpdateDto,
  UserRole,
} from '@/core/models';
import { SKILL_SERVICE, SkillService } from '@/core/services';
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

@Controller('/admin/skills')
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class SkillAdminController {
  constructor(@Inject(SKILL_SERVICE) private skillService: SkillService) {}

  @Post()
  async create(@Body() values: SkillCreateDto) {
    return await this.skillService.create(values);
  }

  @Put()
  async update(@Body() values: SkillUpdateDto) {
    return await this.skillService.update(values);
  }

  @Get()
  async find(@Query() query: SkillQueryDto) {
    return await this.skillService.find(query);
  }

  @Get(':id')
  async getSkill(@Param('id', ParseIntPipe) id: number) {
    return await this.skillService.findById(id);
  }

  @Delete(':id')
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    await this.skillService.delete(id);
  }
}
