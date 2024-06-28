import { PostDto } from '../models';

export interface PostRevisionService {
  save(oldPost: PostDto, newPost: PostDto): Promise<void>;

  //   findByPostId(postId: string): Promise<PageDto<PostDto>>;
}

export const POST_REVISION_SERVICE = 'PostRevisionService';
