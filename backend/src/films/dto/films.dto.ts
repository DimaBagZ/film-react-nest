import { ApiProperty } from '@nestjs/swagger';

// DTO для фильма
export class FilmDto {
  @ApiProperty({ description: 'Уникальный идентификатор фильма' })
  id: string;

  @ApiProperty({ description: 'Рейтинг фильма', example: 8.5 })
  rating: number;

  @ApiProperty({ description: 'Режиссер фильма', example: 'Кристофер Нолан' })
  director: string;

  @ApiProperty({ description: 'Теги фильма', example: ['Драма', 'Триллер'] })
  tags: string[];

  @ApiProperty({ description: 'Название фильма', example: 'Интерстеллар' })
  title: string;

  @ApiProperty({ description: 'Краткое описание фильма' })
  about: string;

  @ApiProperty({ description: 'Полное описание фильма' })
  description: string;

  @ApiProperty({
    description: 'Путь к изображению фильма',
    example: '/bg1s.jpg',
  })
  image: string;

  @ApiProperty({ description: 'Путь к обложке фильма', example: '/bg1c.jpg' })
  cover: string;
}

// DTO для сеанса фильма
export class SessionDto {
  @ApiProperty({ description: 'Уникальный идентификатор сеанса' })
  id: string;

  @ApiProperty({
    description: 'Дата и время сеанса',
    example: '2024-01-15T10:00:00.000Z',
  })
  daytime: string;

  @ApiProperty({ description: 'Номер зала', example: 1 })
  hall: number;

  @ApiProperty({ description: 'Количество рядов', example: 10 })
  rows: number;

  @ApiProperty({ description: 'Количество мест в ряду', example: 20 })
  seats: number;

  @ApiProperty({ description: 'Цена билета', example: 350 })
  price: number;

  @ApiProperty({ description: 'Список занятых мест', example: ['1:5', '2:3'] })
  taken: string[];
}

// DTO для ответа со списком фильмов
export class FilmsResponseDto {
  @ApiProperty({ description: 'Общее количество фильмов' })
  total: number;

  @ApiProperty({ description: 'Список фильмов', type: [FilmDto] })
  items: FilmDto[];
}

// DTO для ответа с расписанием фильма
export class FilmScheduleResponseDto {
  @ApiProperty({ description: 'Общее количество сеансов' })
  total: number;

  @ApiProperty({ description: 'Список сеансов', type: [SessionDto] })
  items: SessionDto[];
}
