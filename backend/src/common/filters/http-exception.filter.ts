import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Специальная обработка ошибок валидации
      if (exception instanceof BadRequestException && status === 422) {
        const validationErrors = exceptionResponse as any;

        if (
          validationErrors.message &&
          Array.isArray(validationErrors.message)
        ) {
          // Формируем понятное сообщение об ошибке валидации
          const errorMessages = validationErrors.message.map(
            (error: string) => {
              // Убираем технические детали и оставляем понятное сообщение
              return error.replace(/^[^:]+: /, '');
            },
          );

          message = {
            statusCode: status,
            message: errorMessages.join('. '),
            error: 'Validation Error',
            details: validationErrors.message,
          };
        } else {
          message = {
            statusCode: status,
            message: 'Ошибка валидации данных',
            error: 'Validation Error',
          };
        }
      } else {
        // Форматируем ошибку в понятном виде для фронтенда
        if (
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
        ) {
          // Если это массив сообщений (например, от валидации), берем первое
          const errorMessage = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0]
            : exceptionResponse.message;

          message = {
            statusCode: status,
            message: errorMessage,
            error: 'Bad Request',
          };
        } else if (typeof exceptionResponse === 'string') {
          message = {
            statusCode: status,
            message: exceptionResponse,
            error: 'Bad Request',
          };
        } else {
          message = {
            statusCode: status,
            message: exception.message,
            error: exceptionResponse,
          };
        }
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = {
        statusCode: status,
        message: 'Внутренняя ошибка сервера',
        error:
          exception instanceof Error ? exception.message : 'Неизвестная ошибка',
      };
    }

    // Добавляем CORS заголовки для фронтенда
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    response.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    response.status(status).json(message);
  }
}
