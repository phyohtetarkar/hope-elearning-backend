import { CourseQueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CourseQueryTransformPipe
  implements PipeTransform<CourseQueryDto, CourseQueryDto>
{
  constructor(private security: SecurityContextService) {}

  transform(value: CourseQueryDto, metadata: ArgumentMetadata): CourseQueryDto {
    const user = this.security.getAuthenticatedUser();
    if (user.isAdminOrOwner()) {
      return value;
    }

    value.author = user.id;
    return value;
  }
}
