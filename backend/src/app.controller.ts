import {
  Controller,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'fs';

@Controller('content/afisha')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Get('*')
  serveStaticFile(@Param('*') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join(
        __dirname,
        '..',
        'public',
        'content',
        'afisha',
        filename,
      );
      this.logger.log(`Requesting file: ${filename}`);
      this.logger.log(`Full path: ${filePath}`);

      if (fs.existsSync(filePath)) {
        this.logger.log(`File exists, serving: ${filename}`);
        return res.sendFile(filePath);
      } else {
        this.logger.error(`File not found: ${filePath}`);
        throw new HttpException(
          `File not found: ${filename}`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      this.logger.error(`Error serving file: ${error.message}`);
      throw new HttpException(
        `Error serving file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
