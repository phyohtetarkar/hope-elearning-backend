import { Inject, Injectable } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { MODULE_OPTIONS_TOKEN } from './firebase.module-definition';
import { FirebaseModuleOptions } from './firebase-module-options.interface';

@Injectable()
export class FirebaseAuthService {
  private auth: Auth;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: FirebaseModuleOptions) {
    // console.log(dirname(require.main?.filename ?? '/content'));

    if (!options.serviceAccount) {
      throw 'Required firebase service account path';
    }

    const app = initializeApp({
      credential: cert(options.serviceAccount),
    });

    this.auth = getAuth(app);
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken;
    } catch (e) {
      return undefined;
    }
  }

  async getUser(id: string) {
    try {
      return await this.auth.getUser(id);
    } catch (e) {
      return undefined;
    }
  }
}
