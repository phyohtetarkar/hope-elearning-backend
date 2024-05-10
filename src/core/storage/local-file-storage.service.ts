import { splitFileExtension } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { closeSync, openSync, renameSync } from 'fs';
import { FileStorageResult, FileStorageService } from './file-storage.service';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  constructor(private configService: ConfigService) {}

  async writeFile(file: Express.Multer.File): Promise<FileStorageResult> {
    const fileName = await this.createUniqueFile(file);
    return {
      fileName: fileName,
      url: `http://localhost/${file.destination}/${fileName}`,
    };
  }

  private async createUniqueFile(file: Express.Multer.File): Promise<string> {
    let index = 0;
    let fileName: string | undefined = undefined;
    const originalname = file.originalname;
    const splittedName = splitFileExtension(originalname);
    const destination = file.destination;

    while (!fileName) {
      try {
        const name =
          index > 0
            ? `${splittedName.name}-${index}${splittedName.extension ?? ''}`
            : originalname;
        const dest = `${destination}/${name}`;

        // wx flag to fail on file exists
        closeSync(openSync(dest, 'wx'));

        renameSync(file.path, dest);

        fileName = name;
      } catch (error) {
        await new Promise((resolve) => setTimeout(() => resolve(true), 1000));
        index += 1;
      }
    }

    return fileName;
  }
}
