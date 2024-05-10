export interface FileStorageResult {
  fileName: string;
  url: string;
}

export interface FileStorageService {
  writeFile(file: Express.Multer.File): Promise<FileStorageResult>;
}

export const FILE_STORAGE_SERVICE = 'FileStorageService';
