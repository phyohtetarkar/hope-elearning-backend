import { CourseUpdateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CourseUpdateTransformPipe
  implements PipeTransform<CourseUpdateDto, CourseUpdateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(
    value: CourseUpdateDto,
    metadata: ArgumentMetadata,
  ): CourseUpdateDto {
    const user = this.security.getAuthenticatedUser();
    if (user.isAdminOrOwner()) {
      return value;
    }

    value.authors = undefined;
    value.access = undefined;

    return value;
  }
}
