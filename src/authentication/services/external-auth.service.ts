import { AuthUserDto } from '../models/auth-user.dto';
import { SingUpInput } from '../models/sign-up.input';

export interface ExternalAuthService {
  /**
   * Verifies access token (JWT). If the token is valid, the promise is fulfilled with the UID.
   * @param token The access token to verify.
   * @returns A promise fulfilled with the UID if the ID token is valid.
   */
  verifyToken(token: string): Promise<string | undefined>;

  getUser(id: string): Promise<AuthUserDto | null>;

  createUser(values: SingUpInput): Promise<string>;
}

export const EXTERNAL_AUTH_SERVICE = 'ExternalAuthService';
