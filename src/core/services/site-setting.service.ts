import { SiteSettingDto } from '../models';

export interface SiteSettingService {
  updateAboutUs(values: string): Promise<void>;

  updatePrivacyPolicy(values: string): Promise<void>;

  updateTermsAndConditions(values: string): Promise<void>;

  getAboutUs(): Promise<string>;

  getPrivacyPolicy(): Promise<string>;

  getTermsAndConditions(): Promise<string>;

  getSiteSetting(): Promise<SiteSettingDto>;
}

export const SITE_SETTING_SERVICE = 'SiteSettingService';
