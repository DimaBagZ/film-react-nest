import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    // Мокаем console.log для проверки вывода
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('log', () => {
    it('должен форматировать простое сообщение в JSON', () => {
      const message = 'Тестовое сообщение';

      logger.log(message);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^{"timestamp":".*","level":"log","message":"Тестовое сообщение"}$/,
        ),
      );
    });

    it('должен форматировать сообщение с дополнительными параметрами', () => {
      const message = 'Тестовое сообщение';
      const param1 = 'дополнительный параметр';
      const param2 = { key: 'value' };

      logger.log(message, param1, param2);

      const logCall = consoleSpy.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('log');
      expect(parsedLog.message).toBe('Тестовое сообщение');
      expect(parsedLog.optionalParams).toEqual([
        'дополнительный параметр',
        { key: 'value' },
      ]);
    });

    it('должен обрабатывать объекты как сообщения', () => {
      const messageObj = { test: 'data', number: 123 };

      logger.log(messageObj);

      const logCall = consoleSpy.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.message).toBe('{"test":"data","number":123}');
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
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('error');
      expect(parsedLog.message).toBe('Ошибка приложения');
      expect(parsedLog.optionalParams).toEqual([
        'Error: Something went wrong',
        'AppService',
      ]);
    });

    it('должен обрабатывать ошибку без дополнительных параметров', () => {
      const message = 'Простая ошибка';

      logger.error(message);

      const logCall = consoleErrorSpy.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('error');
      expect(parsedLog.message).toBe('Простая ошибка');
      expect(parsedLog.optionalParams).toBeUndefined();
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
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('warn');
      expect(parsedLog.message).toBe('Предупреждение');
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
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('debug');
      expect(parsedLog.message).toBe('Отладочная информация');
    });
  });

  describe('verbose', () => {
    it('должен форматировать подробное сообщение', () => {
      const message = 'Подробная информация';

      logger.verbose(message);

      const logCall = consoleSpy.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.level).toBe('verbose');
      expect(parsedLog.message).toBe('Подробная информация');
    });
  });

  describe('timestamp', () => {
    it('должен включать валидный timestamp в ISO формате', () => {
      const message = 'Тест timestamp';

      logger.log(message);

      const logCall = consoleSpy.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);

      expect(parsedLog.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });
  });
});
