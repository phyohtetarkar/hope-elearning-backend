import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';

@Injectable()
export class JwtVerificationService {
  private jwkSetUri: string;
  private issuerUri: string;
  constructor(configService: ConfigService) {
    this.jwkSetUri = configService.getOrThrow<string>('JWK_SET_URI');
    this.issuerUri = configService.getOrThrow<string>('ISSUER_URI');
  }

  async verify(token: string) {
    try {
      const JWKS = jose.createRemoteJWKSet(new URL(this.jwkSetUri));
      const { payload } = await jose.jwtVerify(token, JWKS, {
        issuer: this.issuerUri,
      });
      return payload;
    } catch (e) {
      throw e;
    }
  }
}
