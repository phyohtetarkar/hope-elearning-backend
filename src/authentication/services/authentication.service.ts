import { SingUpInput } from '../models/sign-up.input';

export interface AuthenticationService {
  signUp(values: SingUpInput): Promise<void>;
}

export const AUTHENTICATION_SERVICE = 'AuthenticationService';
