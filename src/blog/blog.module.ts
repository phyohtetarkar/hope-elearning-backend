import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [TagModule, PostModule],
})
export class BlogModule {}
