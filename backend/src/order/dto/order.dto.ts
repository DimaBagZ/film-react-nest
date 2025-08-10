import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsArray,
  IsNumber,
  IsNotEmpty,
  Matches,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO для элемента заказа
export class OrderItemDto {
  @ApiProperty({ description: 'ID фильма' })
  @IsString()
  @IsNotEmpty()
  film: string;

  @ApiProperty({ description: 'ID сеанса' })
  @IsString()
  @IsNotEmpty()
  session: string;

  @ApiProperty({ description: 'Номер ряда', example: 1 })
  @IsNumber()
  row: number;

  @ApiProperty({ description: 'Номер места', example: 5 })
  @IsNumber()
  seat: number;

  @ApiProperty({ description: 'Цена билета', example: 350 })
  @IsNumber()
  price: number;
}

// DTO для создания заказа
export class CreateOrderDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({
    description: 'Телефон пользователя',
    example: '+7 (999) 123-45-67',
  })
  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Matches(
    /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
    {
      message:
        'Некорректный формат телефона. Используйте формат: +7 (999) 123-45-67 или 8 (999) 123-45-67',
    },
  )
  phone: string;

  @ApiProperty({
    description: 'Список билетов для бронирования',
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Должен быть выбран хотя бы один билет' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
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
