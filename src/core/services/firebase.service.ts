import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private apiKey: string;
  constructor(configService: ConfigService) {
    this.apiKey = configService.getOrThrow<string>('FIREBASE_API_KEY');
  }
  async getUser(uid: string) {
    return {
      uid: '',
      displayName: '',
      email: '',
      phoneNumber: '',
    };
  }
}
