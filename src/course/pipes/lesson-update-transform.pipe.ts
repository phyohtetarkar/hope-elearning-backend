import { LessonUpdateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LessonUpdateTransformPipe
  implements PipeTransform<LessonUpdateDto, LessonUpdateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(
    value: LessonUpdateDto,
    metadata: ArgumentMetadata,
  ): LessonUpdateDto {
    const user = this.security.getAuthenticatedUser();
    value.updatedBy = user.id;
    return value;
  }
}
