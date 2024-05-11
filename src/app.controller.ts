import {
  Controller,
  Get,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { closeSync, openSync, rename } from 'fs';
import {
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from './core/storage/file-storage.service';

@Controller('test')
export class AppController {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private fileStorageService: FileStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async getHello(@UploadedFile() file: Express.Multer.File) {
    // console.log(file.destination);
    // console.log(file.path);
    // console.log(file.originalname);

    // const dest = `${file.destination}/${file.originalname}`;

    // // wx flag to fail on file exists
    // closeSync(openSync(dest, 'wx'));

    // rename(file.path, dest, (err) => {
    //   console.log(err);
    // });

    const result = await this.fileStorageService.writeFile(file);
    console.log(result);
  }

  @Get()
  sayHello(): string {
    return 'Hello, world';
  }
}
