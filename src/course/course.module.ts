import { CategoryEntity } from '@/core/entities/category.entity';
import { SkillEntity } from '@/core/entities/skill.entity';
import { CATEGORY_SERVICE, SKILL_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCategoryService } from './services/typeorm-category.service';
import { TypeormSkillService } from './services/typeorm-skill.service';
import { CategoryAdminController } from './controllers/category-admin.controller';
import { SkillAdminController } from './controllers/skill-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, SkillEntity])],
  providers: [
    {
      provide: CATEGORY_SERVICE,
      useClass: TypeormCategoryService,
    },
    {
      provide: SKILL_SERVICE,
      useClass: TypeormSkillService,
    },
  ],
  controllers: [CategoryAdminController, SkillAdminController],
})
export class CourseModule {}
