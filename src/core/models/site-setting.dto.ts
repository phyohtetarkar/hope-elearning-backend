export class SiteSettingDto {
  aboutUs?: string;

  privacyPolicy?: string;

  termsAndConditions?: string;

  constructor(partial: Partial<SiteSettingDto> = {}) {
    Object.assign(this, partial);
  }
}
