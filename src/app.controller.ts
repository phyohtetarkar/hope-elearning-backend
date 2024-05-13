import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from './core/storage/file-storage.service';

@Controller('common')
export class AppController {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private fileStorageService: FileStorageService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileStorageService.writeFile(file);

    if (!result) {
      throw new BadRequestException('Required upload file');
    }

    return result.url;
  }
}
