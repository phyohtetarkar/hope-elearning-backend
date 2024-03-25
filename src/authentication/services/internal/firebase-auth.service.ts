import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAuth } from 'firebase-admin/auth';
import { cert, initializeApp } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { SingUpInput } from '../../models/sign-up.input';
import { ExternalAuthService } from '../external-auth.service';
import { AuthUserDto } from '@/authentication/models/auth-user.dto';
import { dirname } from 'path';

@Injectable()
export class FirebaseAuthService implements ExternalAuthService {
  private auth: Auth;

  constructor(configService: ConfigService) {
    console.log(dirname(require.main?.filename ?? '/content'));
    const serviceAccountPath = configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );

    if (!serviceAccountPath) {
      throw 'Required firebase service account path';
    }

    const app = initializeApp({
      credential: cert(serviceAccountPath),
    });

    this.auth = getAuth(app);
  }

  async verifyToken(token: string): Promise<string | undefined> {
    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken.uid;
    } catch (e) {
      return undefined;
    }
  }

  async getUser(id: string): Promise<AuthUserDto | null> {
    try {
      const record = await this.auth.getUser(id);
      return {
        id: record.uid,
        fullName: record.displayName ?? 'User',
        email: record.email,
        phone: record.phoneNumber,
      };
    } catch (e) {
      return null;
    }
  }

  async createUser(values: SingUpInput): Promise<string> {
    const record = await this.auth.createUser({
      email: values.email,
      password: values.password,
    });

    return record.uid;
  }
}
