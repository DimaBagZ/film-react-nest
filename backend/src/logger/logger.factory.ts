import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

/**
 * Типы доступных логгеров
 */
export type LoggerType = 'dev' | 'json' | 'tskv';

/**
 * Фабрика логгеров
 * Создает экземпляр логгера в зависимости от переменной окружения LOGGER_TYPE
 */
export class LoggerFactory {
  /**
   * Создает экземпляр логгера на основе переменной окружения
   */
  static createLogger(): LoggerService {
    const loggerType = process.env.LOGGER_TYPE || 'dev';

    switch (loggerType.toLowerCase()) {
      case 'json':
        return new JsonLogger();
      case 'tskv':
        return new TskvLogger();
      case 'dev':
      default:
        return new DevLogger();
    }
  }

  /**
   * Получает тип текущего логгера
   */
  static getLoggerType(): LoggerType {
    const loggerType = process.env.LOGGER_TYPE || 'dev';

    switch (loggerType.toLowerCase()) {
      case 'json':
        return 'json';
      case 'tskv':
        return 'tskv';
      case 'dev':
      default:
        return 'dev';
    }
  }
}
