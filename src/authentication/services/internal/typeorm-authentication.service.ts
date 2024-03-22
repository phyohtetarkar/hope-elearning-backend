import { SingUpInput } from '@/authentication/models/sign-up.input';
import { normalizeSlug, stringToSlug } from '@/common/utils';
import { User } from '@/user/models/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthenticationService } from '../authentication.service';
import {
  EXTERNAL_AUTH_SERVICE,
  ExternalAuthService,
} from '../external-auth.service';

@Injectable()
export class TypeormAuthenticationService implements AuthenticationService {
  constructor(
    private dataSource: DataSource,
    @Inject(EXTERNAL_AUTH_SERVICE)
    private authService: ExternalAuthService,
  ) {}

  async signUp(values: SingUpInput): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      const uid = await this.authService.createUser(values);
      const entity = new User();
      entity.id = uid;
      entity.fullName = values.fullName;
      entity.email = values.email;
      entity.username = await normalizeSlug(
        stringToSlug(values.fullName),
        (v) => {
          return em.existsBy(User, { username: v });
        },
      );

      await em.save(entity);
    });
  }
}
