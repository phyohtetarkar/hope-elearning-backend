import { PostCreateDto } from '@/core/models';
import { SecurityContextService } from '@/core/security/security-context.service';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PostCreateTransformPipe
  implements PipeTransform<PostCreateDto, PostCreateDto>
{
  constructor(private security: SecurityContextService) {}

  transform(value: PostCreateDto, metadata: ArgumentMetadata): PostCreateDto {
    const user = this.security.getAuthenticatedUser();
    value.authors = [user.id];

    return value;
  }
}
