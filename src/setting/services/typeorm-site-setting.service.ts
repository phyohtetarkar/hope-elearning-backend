import { SiteSettingEntity } from '@/core/entities/site-setting.entity';
import { AuditEvent } from '@/core/events';
import { SiteSettingDto } from '@/core/models';
import { SiteSettingService } from '@/core/services';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormSiteSettingService implements SiteSettingService {
  private DEFAULT_ID = 1;

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(SiteSettingEntity)
    private siteSettingRepo: Repository<SiteSettingEntity>,
  ) {}

  async updateAboutUs(values: string): Promise<void> {
    await this.siteSettingRepo.upsert(
      {
        id: this.DEFAULT_ID,
        aboutUs: values,
      },
      ['id'],
    );

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: 'about-us',
        resourceType: 'setting',
        context: JSON.stringify({ title: 'About Us' }),
      }),
    );
  }

  async updatePrivacyPolicy(values: string): Promise<void> {
    await this.siteSettingRepo.upsert(
      {
        id: this.DEFAULT_ID,
        privacyPolicy: values,
      },
      ['id'],
    );

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: 'privacy-policy',
        resourceType: 'setting',
        context: JSON.stringify({ title: 'Privacy Policy' }),
      }),
    );
  }

  async updateTermsAndConditions(values: string): Promise<void> {
    await this.siteSettingRepo.upsert(
      {
        id: this.DEFAULT_ID,
        termsAndConditions: values,
      },
      ['id'],
    );

    this.eventEmitter.emit(
      'audit.updated',
      new AuditEvent({
        resourceId: 'terms-and-conditions',
        resourceType: 'setting',
        context: JSON.stringify({ title: 'Terms And Conditions' }),
      }),
    );
  }

  async getAboutUs(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.aboutUs AS about_us'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw?.['about_us'] ?? '';
  }

  async getPrivacyPolicy(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.privacyPolicy AS privacy_policy'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw?.['privacy_policy'] ?? '';
  }

  async getTermsAndConditions(): Promise<string> {
    const raw = await this.siteSettingRepo
      .createQueryBuilder('ss')
      .select(['ss.termsAndConditions AS terms_and_conditions'])
      .where('ss.id = :id', { id: this.DEFAULT_ID })
      .getRawOne();

    return raw?.['terms_and_conditions'] ?? '';
  }

  async getSiteSetting(): Promise<SiteSettingDto> {
    const entity = await this.siteSettingRepo.findOneBy({
      id: this.DEFAULT_ID,
    });

    return entity?.toDto() ?? new SiteSettingDto();
  }
}
