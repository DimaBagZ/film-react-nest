import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    // Мокаем console.log для проверки вывода
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('log', () => {
    it('должен форматировать простое сообщение в TSKV формат', () => {
      const message = 'Тестовое сообщение';

      logger.log(message);

      const logCall = consoleSpy.mock.calls[0][0];

      // Проверяем структуру TSKV записи
      expect(logCall).toMatch(
        /^time=.*\tlevel=log\tmessage=Тестовое сообщение$/,
      );
    });

    it('должен форматировать сообщение с дополнительными параметрами', () => {
      const message = 'Тестовое сообщение';
      const param1 = 'дополнительный параметр';
      const param2 = { key: 'value' };

      logger.log(message, param1, param2);

      const logCall = consoleSpy.mock.calls[0][0];

      // Проверяем наличие всех полей
      expect(logCall).toMatch(
        /^time=.*\tlevel=log\tmessage=Тестовое сообщение\tparam0=дополнительный параметр\tparam1=\{"key":"value"\}$/,
      );
    });

    it('должен обрабатывать объекты как сообщения', () => {
      const messageObj = { test: 'data', number: 123 };

      logger.log(messageObj);

      const logCall = consoleSpy.mock.calls[0][0];

      expect(logCall).toMatch(
        /^time=.*\tlevel=log\tmessage=\{"test":"data","number":123\}$/,
      );
    });

    it('должен экранировать специальные символы в сообщениях', () => {
      const message =
        'Сообщение с\tтабуляцией\nи переносом\rстроки\\обратный слеш';

      logger.log(message);

      const logCall = consoleSpy.mock.calls[0][0];

      // Проверяем что специальные символы экранированы
      expect(logCall).toContain(
        'message=Сообщение с\\\\tтабуляцией\\\\nи переносом\\\\rстроки\\\\обратный слеш',
      );
    });
  });

  describe('error', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('должен форматировать ошибку с trace и context', () => {
      const message = 'Ошибка приложения';
      const trace = 'Error: Something went wrong';
      const context = 'AppService';

      logger.error(message, trace, context);

      const logCall = consoleErrorSpy.mock.calls[0][0];

      expect(logCall).toMatch(
        /^time=.*\tlevel=error\tmessage=Ошибка приложения\tparam0=Error: Something went wrong\tparam1=AppService$/,
      );
    });

    it('должен обрабатывать ошибку без дополнительных параметров', () => {
      const message = 'Простая ошибка';

      logger.error(message);

      const logCall = consoleErrorSpy.mock.calls[0][0];

      expect(logCall).toMatch(/^time=.*\tlevel=error\tmessage=Простая ошибка$/);
    });
  });

  describe('warn', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('должен форматировать предупреждение', () => {
      const message = 'Предупреждение';

      logger.warn(message);

      const logCall = consoleWarnSpy.mock.calls[0][0];

      expect(logCall).toMatch(/^time=.*\tlevel=warn\tmessage=Предупреждение$/);
    });
  });

  describe('debug', () => {
    let consoleDebugSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    });

    afterEach(() => {
      consoleDebugSpy.mockRestore();
    });

    it('должен форматировать отладочное сообщение', () => {
      const message = 'Отладочная информация';

      logger.debug(message);

      const logCall = consoleDebugSpy.mock.calls[0][0];

      expect(logCall).toMatch(
        /^time=.*\tlevel=debug\tmessage=Отладочная информация$/,
      );
    });
  });

  describe('verbose', () => {
    it('должен форматировать подробное сообщение', () => {
      const message = 'Подробная информация';

      logger.verbose(message);

      const logCall = consoleSpy.mock.calls[0][0];

      expect(logCall).toMatch(
        /^time=.*\tlevel=verbose\tmessage=Подробная информация$/,
      );
    });
  });

  describe('TSKV формат', () => {
    it('должен включать валидный timestamp в ISO формате', () => {
      const message = 'Тест timestamp';

      logger.log(message);

      const logCall = consoleSpy.mock.calls[0][0];

      // Извлекаем timestamp из TSKV записи
      const timeMatch = logCall.match(/time=(.*?)\t/);
      expect(timeMatch).toBeTruthy();

      const timestamp = timeMatch![1];
      expect(timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('должен использовать табуляцию как разделитель полей', () => {
      const message = 'Тест разделителей';

      logger.log(message);

      const logCall = consoleSpy.mock.calls[0][0];

      // Проверяем что поля разделены табуляцией
      const parts = logCall.split('\t');
      expect(parts.length).toBeGreaterThanOrEqual(3);
      expect(parts[0]).toMatch(/^time=/);
      expect(parts[1]).toMatch(/^level=/);
      expect(parts[2]).toMatch(/^message=/);
    });

    it('должен корректно обрабатывать пустые параметры', () => {
      const message = 'Тест пустых параметров';

      logger.log(message, undefined, null, '');

      const logCall = consoleSpy.mock.calls[0][0];

      // Проверяем что undefined и null параметры игнорируются
      expect(logCall).toMatch(
        /^time=.*\tlevel=log\tmessage=Тест пустых параметров\tparam2=$/,
      );
    });
  });
});
