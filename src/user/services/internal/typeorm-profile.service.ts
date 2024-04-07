import { DomainError, normalizeSlug, stringToSlug } from '@/common';
import { UserEntity } from '@/common/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ProfileUpdateInput } from '../../models/profile-update.input';
import { ProfileService } from '../profile.service';
import { SecurityContextProvider } from '@/common/providers/security-context.provider';

export class TypeormProfileService implements ProfileService {
  constructor(
    private security: SecurityContextProvider,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async update(values: ProfileUpdateInput): Promise<void> {
    const authUser = this.security.getAuthenticatedUser();
    if (values.id !== authUser.id) {
      throw new DomainError('forbidden');
    }

    const exists = await this.userRepo.existsBy({ id: values.id });
    if (!exists) {
      throw new DomainError('User not found');
    }

    const username = await normalizeSlug(stringToSlug(values.username), (v) => {
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
