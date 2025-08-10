import { ApiProperty } from '@nestjs/swagger';

// DTO для элемента заказа
export class OrderItemDto {
  @ApiProperty({ description: 'ID фильма' })
  film: string;

  @ApiProperty({ description: 'ID сеанса' })
  session: string;

  @ApiProperty({ description: 'Номер ряда', example: 1 })
  row: number;

  @ApiProperty({ description: 'Номер места', example: 5 })
  seat: number;

  @ApiProperty({ description: 'Цена билета', example: 350 })
  price: number;
}

// DTO для создания заказа
export class CreateOrderDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '+7 (999) 123-45-67',
  })
  phone: string;

  @ApiProperty({
    description: 'Список билетов для бронирования',
    type: [OrderItemDto],
  })
  tickets: OrderItemDto[];
}

// DTO для ответа заказа
export class OrderResponseDto {
  @ApiProperty({ description: 'Успешность операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'Сообщение о результате' })
  message: string;

  @ApiProperty({ description: 'ID созданного заказа' })
  orderId: string;
}
