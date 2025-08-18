import { LoggerService, Injectable } from '@nestjs/common';

/**
 * Логгер для машин с выводом в формате JSON
 * Используется для автоматической обработки логов системами мониторинга
 */
@Injectable()
export class JsonLogger implements LoggerService {
  /**
   * Форматирование сообщения в JSON формат
   */
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      optionalParams: optionalParams.length > 0 ? optionalParams : undefined,
    };

    // Удаляем undefined поля для чистоты JSON
    if (logEntry.optionalParams === undefined) {
      delete logEntry.optionalParams;
    }

    return JSON.stringify(logEntry);
  }

  /**
   * Логирование информационных сообщений
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  /**
   * Логирование ошибок
   */
  error(message: any, trace?: string, context?: string) {
    const params = [trace, context].filter(Boolean);
    console.error(this.formatMessage('error', message, ...params));
  }

  /**
   * Логирование предупреждений
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  /**
   * Логирование отладочной информации
   */
  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  /**
   * Логирование подробной информации
   */
  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
