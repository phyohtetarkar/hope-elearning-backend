import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { mkdirSync } from 'fs';
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
            destination: (req, file, cb) => {
              const date = new Date();
              const month = date.getMonth() + 1;
              const fm = month < 10 ? `0${month}` : month;
              const path = `./content/${date.getFullYear()}/${fm}`;
              mkdirSync(path, { recursive: true });
              cb(null, path);
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MulterModule],
})
export class StorageModule {}
