import { SiteSettingEntity } from '@/core/entities/site-setting.entity';
import { SITE_SETTING_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettingController } from './controllers/site-setting.controller';
import { TypeormSiteSettingService } from './services/typeorm-site-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettingEntity])],
  providers: [
    {
      provide: SITE_SETTING_SERVICE,
      useClass: TypeormSiteSettingService,
    },
  ],
  controllers: [SiteSettingController],
})
export class SettingModule {}
