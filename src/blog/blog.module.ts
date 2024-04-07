import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@/common/entities/tag.entity';
import { PostEntity } from '@/common/entities/post.entity';
import { UserEntity } from '@/common/entities/user.entity';
import { TAG_SERVICE } from './services/tag.service';
import { POST_SERVICE } from './services/post.service';
import { PostTagEntity } from '@/common/entities/post-tag.entity';
import { PostStatisticEntity } from '@/common/entities/post-statistic.entity';
import { TypeormTagService } from './services/internal/typeorm-tag.service';
import { TypeormPostService } from './services/internal/typeorm-post.service';
import { PostController } from './post.controller';
import { PostAdminController } from './post-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TagEntity,
      PostEntity,
      PostTagEntity,
      PostStatisticEntity,
    ]),
  ],
  providers: [
    {
      provide: TAG_SERVICE,
      useClass: TypeormTagService,
    },
    {
      provide: POST_SERVICE,
      useClass: TypeormPostService,
    },
  ],
  controllers: [PostController, PostAdminController],
})
export class BlogModule {}
