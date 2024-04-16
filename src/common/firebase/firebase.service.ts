import { Inject, UnauthorizedException } from '@nestjs/common';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { FirebaseModuleOptions } from './firebase-module-options.interface';
import { MODULE_OPTIONS_TOKEN } from './firebase.module-definition';

export class FirebaseService {
  private auth: Auth;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: FirebaseModuleOptions,
  ) {
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
      throw new UnauthorizedException(e);
    }
  }

  async refreshToken(token: string) {
    try {
      const url = `https://securetoken.googleapis.com/v1/token?key=${this.options.apiKey}`;
      const form = new FormData();
      form.append('grant_type', 'refresh_token');
      form.append('refresh_token', token);
      const resp = await fetch(url, {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const json = await resp.json();
      return {
        accessToken: json['id_token'],
        refreshToken: json['refresh_token'],
      };
    } catch (e) {
      throw new UnauthorizedException(e);
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
