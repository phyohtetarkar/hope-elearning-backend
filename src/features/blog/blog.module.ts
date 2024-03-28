import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from '@/persistence/entities/tag.entity';
import { PostEntity } from '@/persistence/entities/post.entity';
import { UserEntity } from '@/persistence/entities/user.entity';
import { TAG_SERVICE } from './services/tag.service';
import { POST_SERVICE } from './services/post.service';
import { PostTagEntity } from '@/persistence/entities/post-tag.entity';
import { PostStatisticEntity } from '@/persistence/entities/post-statistic.entity';
import { TypeormTagService } from './services/internal/typeorm-tag.service';
import { TypeormPostService } from './services/internal/typeorm-post.service';

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
})
export class BlogModule {}
