import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostHistoryEntity } from './models/post-history.entity';
import { PostStatisticEntity } from './models/post-statistic.entity';
import { PostEntity } from './models/post.entity';
import { PostTagEntity } from './models/post-tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostTagEntity,
      PostHistoryEntity,
      PostStatisticEntity,
    ]),
  ],
})
export class PostModule {}
