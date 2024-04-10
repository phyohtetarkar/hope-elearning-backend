import { UserUpdateDto } from '../models';

export interface UserProfileService {
  update(values: UserUpdateDto): Promise<void>;
}

export const PROFILE_SERVICE = 'ProfileService';
