import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SecurityModule } from './security/security.module';
import { StorageModule } from './storage/storage.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    DatabaseModule,
    SecurityModule,
    StorageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class CoreModule {}
