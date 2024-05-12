import { SiteSettingEntity } from '@/core/entities/site-setting.entity';
import { SiteSettingDto } from '@/core/models';
import { SiteSettingService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormSiteSettingService implements SiteSettingService {
  private DEFAULT_ID = 'setting-default';

  constructor(
    @InjectRepository(SiteSettingEntity)
    private siteSettingRepo: Repository<SiteSettingEntity>,
  ) {}

  async save(values: SiteSettingDto): Promise<void> {
    await this.siteSettingRepo.save({
      id: this.DEFAULT_ID,
      aboutUs: values.aboutUs,
      privacyPolicy: values.privacyPolicy,
      termsAndConditions: values.termsAndConditions,
    });
  }

  async getAboutUs(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.aboutUs AS aboutUs'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw['aboutUs'] ?? '';
  }

  async getPrivacyPolicy(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.privacyPolicy AS privacyPolicy'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw['privacyPolicy'] ?? '';
  }

  async getTermsAndConditions(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.termsAndConditions AS termsAndConditions'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw['termsAndConditions'] ?? '';
  }

  async getSiteSetting(): Promise<SiteSettingDto> {
    const entity = await this.siteSettingRepo.findOneBy({
      id: this.DEFAULT_ID,
    });

    return entity?.toDto() ?? new SiteSettingDto();
  }
}
