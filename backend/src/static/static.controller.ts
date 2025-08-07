import {
  Controller,
  Get,
  Res,
  HttpException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as path from 'node:path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('static')
@Controller()
export class StaticController {
  private readonly logger = new Logger(StaticController.name);

  /**
   * Проверка статуса сервера
   * GET /
   */
  @Get()
  @ApiOperation({ summary: 'Проверка статуса сервера' })
  @ApiResponse({
    status: 200,
    description: 'Сервер работает',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Film! API сервер запущен' },
        timestamp: { type: 'string', example: '2024-08-07T05:04:00.000Z' },
      },
    },
  })
  getStatus() {
    return {
      status: 'ok',
      message: 'Film! API сервер запущен',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('content/afisha/*')
  serveStaticFile(@Res() res: Response, @Req() req: Request) {
    try {
      // Извлекаем имя файла из URL
      const filename = req.url.replace('/content/afisha/', '');
      this.logger.log(`Requesting file: ${filename}`);
      this.logger.log(`Full URL: ${req.url}`);

      if (!filename) {
        this.logger.error('Filename is empty');
        throw new HttpException('Filename is required', HttpStatus.BAD_REQUEST);
      }

      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'content',
        'afisha',
        filename,
      );
      this.logger.log(`Full file path: ${filePath}`);

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
