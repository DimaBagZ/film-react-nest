import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { FilmsResponseDto, FilmScheduleResponseDto } from './dto/films.dto';

/**
 * Контроллер для работы с фильмами
 */
@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  /**
   * Получить список всех фильмов
   * GET /api/afisha/films
   */
  @Get()
  @ApiOperation({ summary: 'Получить список всех фильмов' })
  @ApiResponse({
    status: 200,
    description: 'Список фильмов успешно получен',
    type: FilmsResponseDto,
  })
  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsService.getAllFilms();

    return {
      total: films.length,
      items: films,
    };
  }

  /**
   * Получить расписание конкретного фильма
   * GET /api/afisha/films/:id/schedule
   */
  @Get(':id/schedule')
  @ApiOperation({ summary: 'Получить расписание фильма по ID' })
  @ApiParam({ name: 'id', description: 'ID фильма' })
  @ApiResponse({
    status: 200,
    description: 'Расписание фильма успешно получено',
    type: FilmScheduleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Фильм не найден',
  })
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<FilmScheduleResponseDto> {
    const sessions = await this.filmsService.getFilmSchedule(id);

    return {
      total: sessions.length,
      items: sessions,
    };
  }
}
