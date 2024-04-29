import { CategoryEntity } from '@/core/entities/category.entity';
import { CATEGORY_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAdminController } from './controllers/category-admin.controller';
import { TypeormCategoryService } from './services/typeorm-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    {
      provide: CATEGORY_SERVICE,
      useClass: TypeormCategoryService,
    },
  ],
  controllers: [CategoryAdminController],
})
export class CourseModule {}
