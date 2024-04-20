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
    if (user.isAdminOrOwner()) {
      return value;
    }

    value.authors = undefined;

    return value;
  }
}
