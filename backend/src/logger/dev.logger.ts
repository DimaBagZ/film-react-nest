import { Injectable, ConsoleLogger } from '@nestjs/common';

/**
 * Логгер для разработчиков с цветным выводом
 * Используется в режиме разработки для удобного просмотра логов
 */
@Injectable()
export class DevLogger extends ConsoleLogger {
  constructor() {
    super();
  }

  /**
   * Логирование информационных сообщений
   */
  log(message: any, context?: string) {
    super.log(message, context);
  }

  /**
   * Логирование ошибок
   */
  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  /**
   * Логирование предупреждений
   */
  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  /**
   * Логирование отладочной информации
   */
  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  /**
   * Логирование подробной информации
   */
  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }
}
