import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, SessionDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  // Мок данных для тестов
  const mockFilms: FilmDto[] = [
    {
      id: '1',
      title: 'Тестовый фильм 1',
      about: 'Краткое описание тестового фильма 1',
      description: 'Полное описание тестового фильма 1',
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      rating: 8.5,
      director: 'Режиссер 1',
      tags: ['драма', 'триллер'],
    },
    {
      id: '2',
      title: 'Тестовый фильм 2',
      about: 'Краткое описание тестового фильма 2',
      description: 'Полное описание тестового фильма 2',
      image: '/bg2s.jpg',
      cover: '/bg2c.jpg',
      rating: 7.8,
      director: 'Режиссер 2',
      tags: ['комедия', 'приключения'],
    },
  ];

  const mockSessions: SessionDto[] = [
    {
      id: 'session1',
      daytime: '2024-01-15T18:00:00.000Z',
      hall: 1,
      price: 500,
      rows: 10,
      seats: 15,
      taken: ['1:5', '2:3'],
    },
    {
      id: 'session2',
      daytime: '2024-01-15T20:30:00.000Z',
      hall: 1,
      price: 600,
      rows: 10,
      seats: 15,
      taken: ['3:7'],
    },
  ];

  // Мок сервиса
  const mockFilmsService = {
    getAllFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('должен возвращать список всех фильмов', async () => {
      // Подготавливаем мок
      mockFilmsService.getAllFilms.mockResolvedValue(mockFilms);

      // Выполняем тест
      const result = await controller.getFilms();

      // Проверяем результат
      expect(result).toEqual({
        total: 2,
        items: mockFilms,
      });

      // Проверяем что сервис был вызван
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
    });

    it('должен возвращать пустой список когда фильмов нет', async () => {
      // Подготавливаем мок
      mockFilmsService.getAllFilms.mockResolvedValue([]);

      // Выполняем тест
      const result = await controller.getFilms();

      // Проверяем результат
      expect(result).toEqual({
        total: 0,
        items: [],
      });

      // Проверяем что сервис был вызван
      expect(service.getAllFilms).toHaveBeenCalledTimes(1);
    });

    it('должен обрабатывать ошибки сервиса', async () => {
      // Подготавливаем мок с ошибкой
      const errorMessage = 'Ошибка получения фильмов';
      mockFilmsService.getAllFilms.mockRejectedValue(new Error(errorMessage));

      // Проверяем что ошибка пробрасывается
      await expect(controller.getFilms()).rejects.toThrow(errorMessage);
    });
  });

  describe('getFilmSchedule', () => {
    it('должен возвращать расписание фильма по ID', async () => {
      // Подготавливаем мок
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSessions);

      // Выполняем тест
      const result = await controller.getFilmSchedule('1');

      // Проверяем результат
      expect(result).toEqual({
        total: 2,
        items: mockSessions,
      });

      // Проверяем что сервис был вызван с правильным ID
      expect(service.getFilmSchedule).toHaveBeenCalledWith('1');
      expect(service.getFilmSchedule).toHaveBeenCalledTimes(1);
    });

    it('должен возвращать пустое расписание когда сеансов нет', async () => {
      // Подготавливаем мок
      mockFilmsService.getFilmSchedule.mockResolvedValue([]);

      // Выполняем тест
      const result = await controller.getFilmSchedule('999');

      // Проверяем результат
      expect(result).toEqual({
        total: 0,
        items: [],
      });

      // Проверяем что сервис был вызван
      expect(service.getFilmSchedule).toHaveBeenCalledWith('999');
    });

    it('должен обрабатывать ошибки при получении расписания', async () => {
      // Подготавливаем мок с ошибкой
      const errorMessage = 'Фильм не найден';
      mockFilmsService.getFilmSchedule.mockRejectedValue(
        new Error(errorMessage),
      );

      // Проверяем что ошибка пробрасывается
      await expect(controller.getFilmSchedule('999')).rejects.toThrow(
        errorMessage,
      );
    });

    it('должен корректно обрабатывать строковые ID', async () => {
      // Подготавливаем мок
      mockFilmsService.getFilmSchedule.mockResolvedValue(mockSessions);

      // Выполняем тест с разными типами строковых ID
      const testIds = ['1', 'film-123', 'abc-def-ghi'];

      for (const id of testIds) {
        await controller.getFilmSchedule(id);
        expect(service.getFilmSchedule).toHaveBeenCalledWith(id);
      }
    });
  });
});
