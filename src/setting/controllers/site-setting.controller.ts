import { Roles } from '@/common/decorators';
import { UserRole } from '@/core/models';
import { SITE_SETTING_SERVICE, SiteSettingService } from '@/core/services';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Setting')
@Controller('/content/site-settings')
export class SiteSettingController {
  constructor(
    @Inject(SITE_SETTING_SERVICE)
    private siteSettingService: SiteSettingService,
  ) {}

  @Get()
  async getSiteSetting() {
    return await this.siteSettingService.getSiteSetting();
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Post('about-us')
  async updateAboutUs(@Body('value') values: string) {
    return await this.siteSettingService.updateAboutUs(values);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Post('privacy-policy')
  async updatePrivacyPolicy(@Body('value') values: string) {
    return await this.siteSettingService.updatePrivacyPolicy(values);
  }

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Post('terms-and-conditions')
  async updateTermsAndConditions(@Body('value') values: string) {
    return await this.siteSettingService.updateTermsAndConditions(values);
  }

  @Get('about-us')
  async getAboutUs() {
    return await this.siteSettingService.getAboutUs();
  }

  @Get('privacy-policy')
  async getPrivacyPolicy() {
    return await this.siteSettingService.getPrivacyPolicy();
  }

  @Get('terms-and-conditions')
  async getTermsAndConditions() {
    return await this.siteSettingService.getTermsAndConditions();
  }
}
