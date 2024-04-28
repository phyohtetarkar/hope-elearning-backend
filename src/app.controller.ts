import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { closeSync, openSync, rename } from 'fs';

@Controller()
export class AppController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  getHello(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    const dest = `${file.destination}/${file.originalname}`;

    // wx flag to fail on file exists
    closeSync(openSync(dest, 'wx'));

    rename(file.path, dest, (err) => {
      console.log(err);
    });
  }

  @Get()
  sayHello(): string {
    return 'Hello, world';
  }
}
