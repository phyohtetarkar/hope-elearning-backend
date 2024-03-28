import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { rename, openSync, closeSync } from 'fs';
import { Public } from './security/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  getHello(@UploadedFile() file: Express.Multer.File): string {
    console.log(file);

    const dest = `${file.destination}/${file.originalname}`;

    closeSync(openSync(dest, 'wx'));

    rename(file.path, dest, (err) => {
      console.log(err);
    });
    return this.appService.getHello();
  }
}
