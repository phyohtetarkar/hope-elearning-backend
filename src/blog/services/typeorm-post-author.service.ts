import { PostAuthorEntity } from '@/core/entities/post-author.entity';
import { PostAuthorService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormPostAuthorService implements PostAuthorService {
  constructor(
    @InjectRepository(PostAuthorEntity)
    private postAuthorRepo: Repository<PostAuthorEntity>,
  ) {}

  async existByPostAndAuthor(
    postId: number,
    authorId: string,
  ): Promise<boolean> {
    return await this.postAuthorRepo.existsBy({
      postId: postId,
      authorId: authorId,
    });
  }
}
