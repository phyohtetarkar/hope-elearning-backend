import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          limits: {
            fileSize: 20 * 1024 * 1024,
          },
          storage: diskStorage({
            destination: './content',
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MulterModule],
})
export class StorageModule {}
