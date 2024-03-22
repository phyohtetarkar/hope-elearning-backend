import { Module } from '@nestjs/common';
import { AuditingSubscriber } from './database/auditing.subscriber';
import { DatabaseModule } from './database/database.module';
import { AlsModule } from './als/als.module';

@Module({
  imports: [AlsModule, DatabaseModule],
  providers: [AuditingSubscriber],
})
export class CommonModule {}
