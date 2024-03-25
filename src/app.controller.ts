import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Public } from './common/decorators';
import { rename } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  getHello(@UploadedFile() file: Express.Multer.File): string {
    console.log(file);
    rename(file.path, `${file.destination}/${file.originalname}`, (err) => {
      console.log(err);
    });
    return this.appService.getHello();
  }
}
