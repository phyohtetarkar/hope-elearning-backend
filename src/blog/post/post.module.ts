import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './models/post.entity';
import { PostHistoryEntity } from './models/post-history.entity';
import { PostViewEntity } from './models/post-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, PostHistoryEntity, PostViewEntity]),
  ],
})
export class PostModule {}
