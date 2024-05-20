import { Roles } from '@/common/decorators';
import { SiteSettingDto, UserRole } from '@/core/models';
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
  @Post()
  async updateSiteSetting(@Body() values: SiteSettingDto) {
    return await this.siteSettingService.save(values);
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
