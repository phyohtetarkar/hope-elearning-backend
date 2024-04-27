import { SecurityContextService } from '@/core/security/security-context.service';
import { POST_SERVICE, PostService } from '@/core/services';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(
    private security: SecurityContextService,
    @Inject(POST_SERVICE)
    private postService: PostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = this.security.getAuthenticatedUser();
    if (user.isAdminOrOwner()) {
      return true;
    }

    const id = request.params['id'];

    if (id) {
      return await this.postService.existsByIdAndAuthor(id, user.id);
    }

    return true;
  }
}
