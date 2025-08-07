import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@ApiTags('orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Создать заказ на бронирование билетов
   * POST /order
   */
  @Post()
  @ApiOperation({ summary: 'Создать заказ на бронирование билетов' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Данные для создания заказа',
  })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 1 },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              film: { type: 'string' },
              session: { type: 'string' },
              row: { type: 'number' },
              seat: { type: 'number' },
              price: { type: 'number' },
              daytime: { type: 'string' },
              day: { type: 'string' },
              time: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @ApiResponse({
    status: 409,
    description: 'Место уже занято',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ total: number; items: any[] }> {
    return this.orderService.createOrder(createOrderDto);
  }
}
