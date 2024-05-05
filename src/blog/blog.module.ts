import { PostAuthorEntity } from '@/core/entities/post-author.entity';
import { PostMetaEntity } from '@/core/entities/post-meta.entity';
import { PostRevisionEntity } from '@/core/entities/post-revision.entity';
import { PostTagEntity } from '@/core/entities/post-tag.entity';
import { PostEntity } from '@/core/entities/post.entity';
import { TagEntity } from '@/core/entities/tag.entity';
import { UserEntity } from '@/core/entities/user.entity';
import {
  POST_AUTHOR_SERVICE,
  POST_REVISION_SERVICE,
  POST_SERVICE,
  TAG_SERVICE,
} from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostAdminController } from './controllers/post-admin.controller';
import { PostController } from './controllers/post.controller';
import { TagAdminController } from './controllers/tag-admin.controller';
import { TagController } from './controllers/tag.controller';
import { TypeormPostAuthorService } from './services/typeorm-post-author.service';
import { TypeormPostRevisionService } from './services/typeorm-post-revision.service';
import { TypeormPostService } from './services/typeorm-post.service';
import { TypeormTagService } from './services/typeorm-tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TagEntity,
      PostEntity,
      PostTagEntity,
      PostAuthorEntity,
      PostMetaEntity,
      PostRevisionEntity,
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
    {
      provide: POST_REVISION_SERVICE,
      useClass: TypeormPostRevisionService,
    },
    {
      provide: POST_AUTHOR_SERVICE,
      useClass: TypeormPostAuthorService,
    },
  ],
  controllers: [
    TagController,
    TagAdminController,
    PostController,
    PostAdminController,
  ],
})
export class BlogModule {}
