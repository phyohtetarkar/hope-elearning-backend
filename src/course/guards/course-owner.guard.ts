import { SecurityContextService } from '@/core/security/security-context.service';
import { COURSE_AUTHOR_SERVICE, CourseAuthorService } from '@/core/services';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CourseOwnerGuard implements CanActivate {
  constructor(
    private security: SecurityContextService,
    @Inject(COURSE_AUTHOR_SERVICE)
    private courseAuthorService: CourseAuthorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = this.security.getAuthenticatedUser();
    if (user.isAdminOrOwner()) {
      return true;
    }

    const id =
      request.params['id'] || request.body['courseId'] || request.body['id'];

    if (id) {
      return await this.courseAuthorService.existByCourseAndAuthor(id, user.id);
    }

    return true;
  }
}
