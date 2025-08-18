import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderItemDto } from './dto/order.dto';
import { BadRequestException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  // Мок данных для тестов
  const mockOrderItem: OrderItemDto = {
    film: 'film1',
    session: 'session1',
    row: 5,
    seat: 10,
    price: 500,
  };

  const mockCreateOrderDto: CreateOrderDto = {
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67',
    tickets: [mockOrderItem],
  };

  const mockOrderResponse = {
    total: 1,
    items: [
      {
        id: 'ticket-123',
        film: 'film1',
        session: 'session1',
        row: 5,
        seat: 10,
        price: 500,
        daytime: '2024-01-15T18:00:00.000Z',
        day: '15.01.2024',
        time: '18:00',
      },
    ],
  };

  // Мок сервиса
  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('должен успешно создавать заказ', async () => {
      // Подготавливаем мок
      mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

      // Выполняем тест
      const result = await controller.createOrder(mockCreateOrderDto);

      // Проверяем результат
      expect(result).toEqual(mockOrderResponse);

      // Проверяем что сервис был вызван с правильными данными
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
    });

    it('должен создавать заказ с несколькими билетами', async () => {
      // Подготавливаем данные с несколькими билетами
      const multipleTicketsDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+7 (999) 123-45-67',
        tickets: [
          { ...mockOrderItem, row: 5, seat: 10 },
          { ...mockOrderItem, row: 5, seat: 11 },
          { ...mockOrderItem, row: 6, seat: 5 },
        ],
      };

      const multipleTicketsResponse = {
        total: 3,
        items: [
          { ...mockOrderResponse.items[0], row: 5, seat: 10 },
          { ...mockOrderResponse.items[0], row: 5, seat: 11 },
          { ...mockOrderResponse.items[0], row: 6, seat: 5 },
        ],
      };

      // Подготавливаем мок
      mockOrderService.createOrder.mockResolvedValue(multipleTicketsResponse);

      // Выполняем тест
      const result = await controller.createOrder(multipleTicketsDto);

      // Проверяем результат
      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(3);

      // Проверяем что сервис был вызван
      expect(service.createOrder).toHaveBeenCalledWith(multipleTicketsDto);
    });

    it('должен обрабатывать ошибки валидации', async () => {
      // Подготавливаем мок с ошибкой валидации
      const validationError = new BadRequestException(
        'Email и телефон обязательны',
      );
      mockOrderService.createOrder.mockRejectedValue(validationError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Email и телефон обязательны',
      );
    });

    it('должен обрабатывать ошибку занятого места', async () => {
      // Подготавливаем мок с ошибкой занятого места
      const seatError = new BadRequestException(
        'Место 5 ряд, 10 место уже занято. Выберите другое место.',
      );
      mockOrderService.createOrder.mockRejectedValue(seatError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Место 5 ряд, 10 место уже занято',
      );
    });

    it('должен обрабатывать ошибку несуществующего сеанса', async () => {
      // Подготавливаем мок с ошибкой несуществующего сеанса
      const sessionError = new BadRequestException(
        'Сеанс session999 не найден',
      );
      mockOrderService.createOrder.mockRejectedValue(sessionError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Сеанс session999 не найден',
      );
    });

    it('должен обрабатывать ошибку несуществующего ряда', async () => {
      // Подготавливаем мок с ошибкой несуществующего ряда
      const rowError = new BadRequestException(
        'Ряд 999 не существует. Доступно рядов: 10',
      );
      mockOrderService.createOrder.mockRejectedValue(rowError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Ряд 999 не существует',
      );
    });

    it('должен обрабатывать ошибку несуществующего места', async () => {
      // Подготавливаем мок с ошибкой несуществующего места
      const seatError = new BadRequestException(
        'Место 999 не существует. Доступно мест в ряду: 15',
      );
      mockOrderService.createOrder.mockRejectedValue(seatError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Место 999 не существует',
      );
    });

    it('должен обрабатывать общие ошибки сервиса', async () => {
      // Подготавливаем мок с общей ошибкой
      const generalError = new Error('Неожиданная ошибка сервиса');
      mockOrderService.createOrder.mockRejectedValue(generalError);

      // Проверяем что ошибка пробрасывается
      await expect(controller.createOrder(mockCreateOrderDto)).rejects.toThrow(
        'Неожиданная ошибка сервиса',
      );
    });

    it('должен корректно обрабатывать различные форматы данных', async () => {
      // Тестируем с разными форматами email и телефона
      const testCases = [
        {
          email: 'user@domain.com',
          phone: '+7 (999) 123-45-67',
        },
        {
          email: 'test.user@company.org',
          phone: '8-999-123-45-67',
        },
        {
          email: 'simple@test.ru',
          phone: '+7 999 123 45 67',
        },
      ];

      for (const testCase of testCases) {
        const testDto = {
          ...mockCreateOrderDto,
          email: testCase.email,
          phone: testCase.phone,
        };

        mockOrderService.createOrder.mockResolvedValue(mockOrderResponse);

        const result = await controller.createOrder(testDto);

        expect(result).toEqual(mockOrderResponse);
        expect(service.createOrder).toHaveBeenCalledWith(testDto);
      }
    });
  });
});
