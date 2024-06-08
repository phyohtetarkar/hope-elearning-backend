import {
  FILE_STORAGE_SERVICE,
  FileStorageService,
} from '@/core/storage/file-storage.service';
import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Setting')
@Controller('storage')
export class StorageController {
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
    const sizeInMB = file.size / Math.pow(1024, 2);
    if (sizeInMB <= 0) {
      throw new BadRequestException('File must not empty');
    }

    if (sizeInMB > 10) {
      throw new BadRequestException('File size limit exceeds');
    }

    const result = await this.fileStorageService.writeFile(file);

    if (!result) {
      throw new BadRequestException('File must not empty');
    }

    return result.url;
  }
}
