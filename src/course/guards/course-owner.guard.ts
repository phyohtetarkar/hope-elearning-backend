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

    const courseId =
      request.params['id'] || request.params['courseId'] || request.body['id'];

    if (courseId) {
      return await this.courseAuthorService.existByCourseAndAuthor(
        courseId,
        user.id,
      );
    }

    return true;
  }
}
