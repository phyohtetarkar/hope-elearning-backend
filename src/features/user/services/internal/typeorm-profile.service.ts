import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DomainError, normalizeSlug, stringToSlug } from '@/common';
import { AsyncLocalStorage } from 'async_hooks';
import { UserEntity } from '@/persistence/entities/user.entity';
import { ProfileService } from '../profile.service';
import { ProfileUpdateInput } from '../../models/profile-update.input';
import { SecurityContext } from '@/security';

export class TypeormProfileService implements ProfileService {
  constructor(
    private als: AsyncLocalStorage<SecurityContext>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async update(values: ProfileUpdateInput): Promise<void> {
    if (values.id !== this.als.getStore()?.user?.id) {
      throw new DomainError('User not found');
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
