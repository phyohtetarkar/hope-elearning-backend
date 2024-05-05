import { CourseCreateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CourseCreateTransformPipe
  implements PipeTransform<CourseCreateDto, CourseCreateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(
    value: CourseCreateDto,
    metadata: ArgumentMetadata,
  ): CourseCreateDto {
    const user = this.security.getAuthenticatedUser();
    value.authors = [user.id];

    return value;
  }
}
