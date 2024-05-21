import { PostRevisionEntity } from '@/core/entities/post-revision.entity';
import { PostDto, PostStatus } from '@/core/models';
import { PostRevisionService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormPostRevisionService implements PostRevisionService {
  constructor(
    @InjectRepository(PostRevisionEntity)
    private postRevisionRepo: Repository<PostRevisionEntity>,
  ) {}

  async save(oldPost: PostDto, newPost: PostDto): Promise<void> {
    const currentTime = new Date().getTime() / 1000;
    const lastUpdatedAt = oldPost.audit?.updatedAt
      ? new Date(oldPost.audit.updatedAt).getTime() / 1000
      : 0;
    const timeSince = currentTime - lastUpdatedAt;

    let needToSave = false;
    let reason = 'background_save';
    if (oldPost.status === PostStatus.PUBLISHED) {
      reason = 'explicit_save';
      needToSave = true;
    } else if (oldPost.audit?.updatedBy !== newPost.audit?.updatedBy) {
      needToSave = true;
    } else if (timeSince > 1800) {
      needToSave = true;
    }

    if (!needToSave) {
      return;
    }

    await this.postRevisionRepo.insert({
      postId: oldPost.id,
      authorId: oldPost.audit?.updatedBy,
      createdAt: new Date(),
      title: oldPost.title,
      cover: oldPost.cover,
      status: oldPost.status,
      lexical: oldPost.lexical,
      reason: reason,
    });
  }
}
