import { DomainError } from '@/common/errors/domain.error';
import { normalizeSlug } from '@/common/utils';
import { UserEntity } from '@/core/entities/user.entity';
import { UserUpdateDto } from '@/core/models';
import { UserProfileService } from '@/core/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

export class TypeormProfileService implements UserProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async update(values: UserUpdateDto): Promise<void> {
    // const authUser = this.security.getAuthenticatedUser();
    // if (values.id !== authUser.id) {
    //   throw new DomainError('forbidden');
    // }

    const exists = await this.userRepo.existsBy({ id: values.id });
    if (!exists) {
      throw new DomainError('User not found');
    }

    const username = await normalizeSlug(values.username, (v) => {
      return this.userRepo.existsBy({ id: Not(values.id), username: v });
    });

    await this.userRepo.update(
      { id: values.id },
      {
        fullName: values.fullName,
        username: username,
        headline: values.headline ?? null,
        bio: values.bio ?? null,
      },
    );
  }
}
