import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/order.dto';
import { FilmsService } from '../films/films.service';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  /**
   * Создать заказ на бронирование билетов
   */
  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<{ total: number; items: any[] }> {
    try {
      // Проверяем email и телефон
      if (!createOrderDto.email || !createOrderDto.phone) {
        throw new BadRequestException('Email и телефон обязательны');
      }

      // Группируем билеты по сеансам для оптимизации
      const ticketsBySession = this.groupTicketsBySession(
        createOrderDto.tickets,
      );

      // Проверяем все билеты в заказе
      for (const [, tickets] of Object.entries(ticketsBySession)) {
        await this.validateOrderItems(tickets);
      }

      // Бронируем места для каждого билета
      const bookedTickets = [];
      for (const ticket of createOrderDto.tickets) {
        await this.bookSeats(ticket);

        // Создаем объект забронированного билета в формате, который ожидает фронтенд
        bookedTickets.push({
          id: this.generateTicketId(),
          film: ticket.film,
          session: ticket.session,
          row: ticket.row,
          seat: ticket.seat,
          price: ticket.price,
          // Добавляем поля, которые ожидает фронтенд
          daytime: new Date().toISOString(), // Временная дата
          day: new Date().toLocaleDateString('ru-RU'),
          time: new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }

      return {
        total: bookedTickets.length,
        items: bookedTickets,
      };
    } catch (error) {
      // Если это уже HttpException, возвращаем как есть
      if (error instanceof HttpException) {
        throw error;
      }

      // Иначе создаем BadRequestException с сообщением
      throw new BadRequestException(
        error.message || 'Ошибка при создании заказа',
      );
    }
  }

  /**
   * Группировка билетов по сеансам
   */
  private groupTicketsBySession(
    tickets: OrderItemDto[],
  ): Record<string, OrderItemDto[]> {
    const grouped: Record<string, OrderItemDto[]> = {};

    for (const ticket of tickets) {
      const sessionKey = `${ticket.film}:${ticket.session}`;
      if (!grouped[sessionKey]) {
        grouped[sessionKey] = [];
      }
      grouped[sessionKey].push(ticket);
    }

    return grouped;
  }

  /**
   * Валидация группы элементов заказа для одного сеанса
   */
  private async validateOrderItems(items: OrderItemDto[]): Promise<void> {
    if (items.length === 0) return;

    const firstItem = items[0];
    const schedule = await this.filmsService.getFilmSchedule(firstItem.film);
    const session = schedule.find((s) => s.id === firstItem.session);

    if (!session) {
      throw new BadRequestException(`Сеанс ${firstItem.session} не найден`);
    }

    // Создаем временный набор занятых мест для проверки дубликатов в заказе
    const tempTakenSeats = new Set(session.taken);
    const seatsInOrder = new Set<string>();

    for (const item of items) {
      // Проверяем границы ряда и места
      if (item.row < 1 || item.row > session.rows) {
        throw new BadRequestException(
          `Ряд ${item.row} не существует. Доступно рядов: ${session.rows}`,
        );
      }
      if (item.seat < 1 || item.seat > session.seats) {
        throw new BadRequestException(
          `Место ${item.seat} не существует. Доступно мест в ряду: ${session.seats}`,
        );
      }

      const seatKey = `${item.row}:${item.seat}`;

      // Проверяем, не занято ли место в базе данных
      if (tempTakenSeats.has(seatKey)) {
        throw new BadRequestException(
          `Место ${item.row} ряд, ${item.seat} место уже занято. Выберите другое место.`,
        );
      }

      // Проверяем, не выбрано ли это место дважды в текущем заказе
      if (seatsInOrder.has(seatKey)) {
        throw new BadRequestException(
          `Место ${item.row} ряд, ${item.seat} место выбрано дважды в заказе.`,
        );
      }

      seatsInOrder.add(seatKey);
      tempTakenSeats.add(seatKey); // Добавляем к временному набору для проверки следующих мест
    }
  }

  /**
   * Валидация элемента заказа (для обратной совместимости)
   */
  private async validateOrderItem(item: OrderItemDto): Promise<void> {
    await this.validateOrderItems([item]);
  }

  /**
   * Бронирование мест
   */
  private async bookSeats(item: OrderItemDto): Promise<void> {
    // Получаем расписание фильма
    const schedule = await this.filmsService.getFilmSchedule(item.film);
    const session = schedule.find((s) => s.id === item.session);

    if (!session) {
      throw new BadRequestException(`Сеанс ${item.session} не найден`);
    }

    // Проверяем еще раз, не занято ли место (на случай, если кто-то забронировал пока мы проверяли)
    const seatKey = `${item.row}:${item.seat}`;
    if (session.taken.includes(seatKey)) {
      throw new BadRequestException(
        `Место ${item.row} ряд, ${item.seat} место уже занято. Выберите другое место.`,
      );
    }

    // Добавляем новое место к существующим занятым местам
    const updatedTakenSeats = [...session.taken, seatKey];

    // Обновляем занятые места в базе данных
    const success = await this.filmsService.updateSessionTakenSeats(
      item.film,
      item.session,
      updatedTakenSeats,
    );

    if (!success) {
      throw new BadRequestException(
        'Не удалось забронировать места. Попробуйте еще раз.',
      );
    }
  }

  /**
   * Генерация ID билета
   */
  private generateTicketId(): string {
    return `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Генерация ID заказа
   */
  private generateOrderId(): string {
    return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
