import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MAX_FILE_SIZE } from './upload.config';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSizeInBytes = MAX_FILE_SIZE;

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('No file provided');
    }

    if (value.size > this.maxSizeInBytes) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${this.maxSizeInBytes / (1024 * 1024)} MB`,
      );
    }

    return value;
  }
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types are: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    return value;
  }
}
