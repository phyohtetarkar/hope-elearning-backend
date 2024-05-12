import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SiteSettingDto } from '../models';
import { AuditingEntity } from './auditing.entity';

@Entity({ name: 'site_setting' })
export class SiteSettingEntity extends AuditingEntity {
  @PrimaryColumn({ length: 100 })
  id: string;

  @Column({ name: 'about_us', type: 'text', nullable: true })
  aboutUs?: string | null;

  @Column({ name: 'privacy_policy', type: 'text', nullable: true })
  privacyPolicy?: string | null;

  @Column({ name: 'terms_and_conditions', type: 'text', nullable: true })
  termsAndConditions?: string | null;

  toDto() {
    return new SiteSettingDto({
      aboutUs: this.aboutUs ?? undefined,
      privacyPolicy: this.privacyPolicy ?? undefined,
      termsAndConditions: this.termsAndConditions ?? undefined,
    });
  }
}
