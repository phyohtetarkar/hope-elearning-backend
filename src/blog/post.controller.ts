import { Controller, Inject } from '@nestjs/common';
import { POST_SERVICE, PostService } from './services/post.service';

@Controller('/content/posts')
export class PostController {
  constructor(@Inject(POST_SERVICE) private postService: PostService) {}

  
}
