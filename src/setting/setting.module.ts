import { AuditActionEntity } from '@/core/entities/audit-action.entity';
import { SiteSettingEntity } from '@/core/entities/site-setting.entity';
import { AUDIT_ACTION_SERVICE, SITE_SETTING_SERVICE } from '@/core/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditActionController } from './controllers/audit-action.controller';
import { SiteSettingController } from './controllers/site-setting.controller';
import { StorageController } from './controllers/storage.controller';
import { TypeormAuditActionServiceService } from './services/typeorm-audit-action.service.service';
import { TypeormSiteSettingService } from './services/typeorm-site-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettingEntity, AuditActionEntity])],
  providers: [
    {
      provide: SITE_SETTING_SERVICE,
      useClass: TypeormSiteSettingService,
    },
    {
      provide: AUDIT_ACTION_SERVICE,
      useClass: TypeormAuditActionServiceService,
    },
  ],
  controllers: [
    SiteSettingController,
    AuditActionController,
    StorageController,
  ],
})
export class SettingModule {}
