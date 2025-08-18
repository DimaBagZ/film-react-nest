import { LoggerService, Injectable } from '@nestjs/common';

/**
 * Логгер для систем мониторинга с форматом TSKV (Tab-Separated Key-Value)
 * Используется для интеграции с внешними системами логирования
 */
@Injectable()
export class TskvLogger implements LoggerService {
  /**
   * Форматирование сообщения в TSKV формат
   * TSKV - Tab-Separated Key-Value формат для логов
   */
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const messageStr =
      typeof message === 'string' ? message : JSON.stringify(message);

    // Базовые поля TSKV записи
    const fields = [
      `time=${timestamp}`,
      `level=${level}`,
      `message=${this.escapeTskvValue(messageStr)}`,
    ];

    // Добавляем дополнительные параметры если они есть
    if (optionalParams.length > 0) {
      optionalParams.forEach((param, index) => {
        if (param !== undefined && param !== null) {
          const paramStr =
            typeof param === 'string' ? param : JSON.stringify(param);
          fields.push(`param${index}=${this.escapeTskvValue(paramStr)}`);
        }
      });
    }

    // Объединяем поля табуляцией
    return fields.join('\t');
  }

  /**
   * Экранирование специальных символов в TSKV значениях
   */
  private escapeTskvValue(value: string): string {
    return value
      .replace(/\t/g, '\\t') // Экранируем табуляцию
      .replace(/\n/g, '\\n') // Экранируем перенос строки
      .replace(/\r/g, '\\r') // Экранируем возврат каретки
      .replace(/\\/g, '\\\\'); // Экранируем обратный слеш
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
