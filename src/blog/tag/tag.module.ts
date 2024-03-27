import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './models/tag.entity';
import { TypeormTagService } from './services/internal/typeorm-tag.service';
import { TAG_SERVICE } from './services/tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [
    {
      provide: TAG_SERVICE,
      useClass: TypeormTagService,
    },
  ],
  exports: [TAG_SERVICE],
  controllers: [TagController],
})
export class TagModule {}
