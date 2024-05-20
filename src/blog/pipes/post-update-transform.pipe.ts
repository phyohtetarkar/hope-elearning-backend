import { PostUpdateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostUpdateTransformPipe
  implements PipeTransform<PostUpdateDto, PostUpdateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(value: PostUpdateDto, metadata: ArgumentMetadata) {
    const user = this.security.getAuthenticatedUser();
    value.updatedBy = user.id;

    if (value.publishedAt && new Date(value.publishedAt) > new Date()) {
      value.publishedAt = undefined;
    }

    if (user.isAdminOrOwner()) {
      return value;
    }

    value.authors = undefined;
    value.visibility = undefined;

    return value;
  }
}
