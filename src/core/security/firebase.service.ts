import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private auth: Auth;

  constructor(configService: ConfigService) {
    const serviceAccount = configService.getOrThrow<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    this.auth = getAuth(app);
  }
  async getUser(uid: string) {
    try {
      return await this.auth.getUser(uid);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
