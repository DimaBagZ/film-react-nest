import { FilmDto, SessionDto } from '../films/dto/films.dto';

/**
 * Интерфейс репозитория для работы с фильмами
 */
export interface IFilmsRepository {
  /**
   * Получить все фильмы
   */
  findAll(): Promise<FilmDto[]>;

  /**
   * Получить фильм по ID
   */
  findById(id: string): Promise<FilmDto | null>;

  /**
   * Получить расписание фильма по ID
   */
  getFilmSchedule(id: string): Promise<SessionDto[]>;

  /**
   * Обновить занятые места в сеансе
   */
  updateSessionTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<boolean>;
}
