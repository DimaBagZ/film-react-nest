import { Injectable, Inject } from '@nestjs/common';
import { FilmDto, SessionDto } from './dto/films.dto';
import { IFilmsRepository } from '../repository/films.repository.interface';

/**
 * Сервис для работы с фильмами
 * Использует репозиторий для доступа к данным
 */
@Injectable()
export class FilmsService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  /**
   * Получить все фильмы
   */
  async getAllFilms(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }

  /**
   * Получить фильм по ID
   */
  async getFilmById(id: string): Promise<FilmDto | null> {
    return this.filmsRepository.findById(id);
  }

  /**
   * Получить расписание фильма по ID
   */
  async getFilmSchedule(id: string): Promise<SessionDto[]> {
    return this.filmsRepository.getFilmSchedule(id);
  }

  /**
   * Обновить занятые места в сеансе
   */
  async updateSessionTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<boolean> {
    return this.filmsRepository.updateSessionTakenSeats(
      filmId,
      sessionId,
      takenSeats,
    );
  }
}
