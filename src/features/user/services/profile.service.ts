import { ProfileUpdateInput } from '../models/profile-update.input';

export interface ProfileService {
  update(values: ProfileUpdateInput): Promise<void>;
}

export const PROFILE_SERVICE = 'ProfileService';
