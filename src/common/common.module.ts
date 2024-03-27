import { Module } from '@nestjs/common';
import { AlsModule } from './als/als.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [StorageModule, AlsModule, DatabaseModule],
})
export class CommonModule {}
