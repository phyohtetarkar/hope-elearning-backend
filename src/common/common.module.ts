import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from './firebase/firebase.module';
import { GlobalModule } from './global.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { AuditingSubscriber } from './providers/auditing.subscriber';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entityPrefix: 'el_',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    FirebaseModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        serviceAccount: configService.get<string>('FIREBASE_SERVICE_ACCOUNT'),
      }),
      inject: [ConfigService],
    }),
    GlobalModule,
    StorageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    AuditingSubscriber,
  ],
  exports: [FirebaseModule],
})
export class CommonModule {}
