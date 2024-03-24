import { Module } from '@nestjs/common';
import { AlsModule } from './als/als.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AlsModule, DatabaseModule],
})
export class CommonModule {}
