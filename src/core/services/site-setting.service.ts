import { SiteSettingDto } from '../models';

export interface SiteSettingService {
  save(values: SiteSettingDto): Promise<void>;

  getAboutUs(): Promise<string>;

  getPrivacyPolicy(): Promise<string>;

  getTermsAndConditions(): Promise<string>;

  getSiteSetting(): Promise<SiteSettingDto>;
}

export const SITE_SETTING_SERVICE = 'SiteSettingService';
