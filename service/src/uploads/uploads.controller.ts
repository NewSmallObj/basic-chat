import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { UploadsService } from './uploads.service';


@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter(request, file, cal) {
      const ext = path.extname(file.originalname);
      if (['.jpg', '.png', '.jpeg'].includes(ext)) {
        return cal(null, true);
      } else {
        return cal(new HttpException('文件格式错误',HttpStatus.BAD_REQUEST), false);
      }
    },
  }))
  upload(@UploadedFile() file) {
    return this.uploadsService.create(file);
  }
}
