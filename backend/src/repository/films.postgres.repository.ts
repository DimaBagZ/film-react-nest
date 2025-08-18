import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FilmDto, SessionDto } from '../films/dto/films.dto';
import { IFilmsRepository } from './films.repository.interface';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';

/**
 * Репозиторий фильмов для PostgreSQL (TypeORM)
 * Реализует интерфейс IFilmsRepository, чтобы не менять сервисы/контроллеры
 */
@Injectable()
export class FilmsPostgresRepository implements IFilmsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<FilmDto[]> {
    const repo = this.dataSource.getRepository(FilmEntity);
    const films = await repo.find();
    return films.map(this.mapFilmEntityToDto);
  }

  async findById(id: string): Promise<FilmDto | null> {
    const repo = this.dataSource.getRepository(FilmEntity);
    const film = await repo.findOne({ where: { id } });
    return film ? this.mapFilmEntityToDto(film) : null;
  }

  async getFilmSchedule(id: string): Promise<SessionDto[]> {
    const repo = this.dataSource.getRepository(ScheduleEntity);
    const sessions = await repo.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });
    return sessions.map(this.mapScheduleEntityToDto);
  }

  async updateSessionTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<boolean> {
    const repo = this.dataSource.getRepository(ScheduleEntity);
    // Правильно сериализуем массив в JSON строку
    const takenJson = JSON.stringify(takenSeats);
    const result = await repo.update({ id: sessionId }, { taken: takenJson });
    return result.affected !== undefined && result.affected > 0;
  }

  private mapFilmEntityToDto = (e: FilmEntity): FilmDto => ({
    id: e.id,
    rating: e.rating,
    director: e.director,
    tags: e.tags,
    title: e.title,
    about: e.about,
    description: e.description,
    image: e.image,
    cover: e.cover,
  });

  private mapScheduleEntityToDto = (e: ScheduleEntity): SessionDto => ({
    id: e.id,
    daytime: e.daytime,
    hall: e.hall,
    rows: e.rows,
    seats: e.seats,
    price: e.price,
    taken: this.parseTakenSeats(e.taken),
  });

  private parseTakenSeats(taken: string | null): string[] {
    if (!taken || taken === '' || taken === '[]') {
      return [];
    }

    // Если это JSON массив, парсим его
    if (taken.startsWith('[') && taken.endsWith(']')) {
      try {
        return JSON.parse(taken);
      } catch {
        return [];
      }
    }

    // Если это строка с разделителями (например, "3:3,1:4,1:5")
    if (taken.includes(',')) {
      return taken
        .split(',')
        .map((seat) => seat.trim())
        .filter((seat) => seat !== '');
    }

    // Если это одиночное место
    return taken.trim() ? [taken.trim()] : [];
  }
}
