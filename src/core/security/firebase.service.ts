import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private apiKey: string;
  private auth: Auth;

  constructor(configService: ConfigService) {
    this.apiKey = configService.getOrThrow<string>('FIREBASE_API_KEY');

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
