import { PostQueryDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostQueryTransformPipe
  implements PipeTransform<PostQueryDto, PostQueryDto>
{
  constructor(private security: SecurityContextService) {}

  transform(value: PostQueryDto, metadata: ArgumentMetadata) {
    const user = this.security.getAuthenticatedUser();
    if (user.isAdminOrOwner()) {
      return value;
    }

    value.authorId = user.id;
    return value;
  }
}
