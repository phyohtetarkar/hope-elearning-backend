import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostHistoryEntity } from './models/post-history.entity';
import { PostStatisticEntity } from './models/post-statistic.entity';
import { PostEntity } from './models/post.entity';
import { PostTagEntity } from './models/post-tag.entity';
import { POST_SERVICE } from './services/post.service';
import { TypeormPostService } from './services/internal/typeorm-post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostTagEntity,
      PostHistoryEntity,
      PostStatisticEntity,
    ]),
  ],
  providers: [
    {
      provide: POST_SERVICE,
      useClass: TypeormPostService,
    },
  ],
  exports: [POST_SERVICE],
})
export class PostModule {}
